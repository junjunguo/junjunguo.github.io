---
layout: post
title: Android Resumable Download
excerpt: "How to implement pause/resume for http file download with Java"
categories: blog
tags: [Android, Java, code, HTTP, Mobile]
image:
  feature: summer2014-119.jpg
  credit: GuoJunjun
  creditlink: https://junjunguo.github.io
comments: true
share: true
---

# Contents
{:.no_toc}

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

#Resumable Download
Resumable download allow users to pause an ongoing download, and begin the download task again whether it is paused or 
interrupted by unusual situations.  

##How to achieve resumable download?
When we communicate with Hypertext Transfer Protocol(HTTP) server, we can use "Byte serving", which allows send only 
a portion of an HTTP/1.1 message form a server to a client. When we already downloaded part of a file, we only need
 to ask the server for the rest of the file. Using Range request header example: 
 
 `Range: bytes=500-999` (bytes=from-to).
 
By request different portion of the file we can also achieve multithreading download.

#App Content
Example code contents:

- UI
    - url input EditText
    - percentage view
    - progress bar view 
    - start button
    - pause button
    - feedback & debug text view
- Main Activity to start the app
- Downloader Class to manage the download
- Message Class to hold the message and download progress.

#Screenshots

Here are some screenshots:

![resume download](https://raw.githubusercontent.com/junjunguo/android/master/2015/ResumeDownload/resumable_download1.png)

![resume download](https://raw.githubusercontent.com/junjunguo/android/master/2015/ResumeDownload/resumable_download2
.png)

![resume download](https://raw.githubusercontent.com/junjunguo/android/master/2015/ResumeDownload/resumable_download3
.png)


#Implementation:

## permission
First we need permissions to storage and internet for save file and connect to internet.

{% highlight xml %}
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.INTERNET" />
{% endhighlight %}
get permissions from manifest.

## Main Activity:

### Directory to save downloaded files
Define the directory where we want to save our downloaded files:
{% highlight java %}
fileDir = new File(Environment.getExternalStoragePublicDirectory(
                Environment.DIRECTORY_DOWNLOADS), "resumedownload");  
{% endhighlight %}
(the file will saved in external storage, for some devices this might not available, so run a check or find an 
alternative solution in your program.)

### Save and read interrupted download 
We use SharedPreferences to save necessary data for resume our download:

- file last modified time, will be used to check if the file has been updated, we want ensure to download the same file.
- percentage of file has been done, will be used to revert progress bar and percentage in UI.

we can save those data at onStop():

{% highlight java %}
SharedPreferences settings = getSharedPreferences(PREFS_NAME, 0);
SharedPreferences.Editor editor = settings.edit();
editor.putString(PREFS_KEY_LASTMODIFIED, mDownloader.getLastModified());
editor.putInt(PREFS_KEY_PROGRESS, progressBar.getProgress());
editor.commit();
{% endhighlight %}

and retrieval our data at onCreate(): 
{% highlight java %}
SharedPreferences settings = getSharedPreferences(PREFS_NAME, 0);
mDownloader = new ResumableDownloader(
        settings.getString(PREFS_KEY_LASTMODIFIED, ""),
        mDownloader.PAUSE);
int progress = settings.getInt(PREFS_KEY_PROGRESS, 0);
progressBar.setProgress(progress);
percentageTV.setText(String.format("%1$" + 3 + "s", progress) + "%");
{% endhighlight %}

### main activity
full view of Main Activity class:
{% highlight java %}
public class MainActivity extends Activity {
    private TextView percentageTV, messageTV;
    private ProgressBar progressBar;
    private EditText url;
    private Button start, pause;
    private AsyncTask asyncTask;
    private String urlStr =
            "http://folk.ntnu.no/junjung/pocketmaps/maps/europe_denmark.ghz";
    //    private String urlStr = "https://farm4.staticflickr
    // .com/3859/14684791333_84e17ac79a_o_d.jpg";
    private String filename;
    private String fileExtension;
    // constant
    public final String PREFS_NAME = "MyResumableDownloadPrefsFile";
    public final String PREFS_KEY_PROGRESS = "Progress";
    public final String PREFS_KEY_LASTMODIFIED = "LastModified";

    private File fileDir;
    private ResumableDownloader mDownloader;

    private boolean asytaskFinished = true;

    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        fileDir = new File(Environment.getExternalStoragePublicDirectory(
                Environment.DIRECTORY_DOWNLOADS), "resumedownload");

        initView();

        SharedPreferences settings = getSharedPreferences(PREFS_NAME, 0);
        mDownloader = new ResumableDownloader(
                settings.getString(PREFS_KEY_LASTMODIFIED, ""),
                mDownloader.PAUSE);
        int progress = settings.getInt(PREFS_KEY_PROGRESS, 0);
        progressBar.setProgress(progress);
        percentageTV.setText(String.format("%1$" + 3 + "s", progress) + "%");
    }

    private void initView() {
        percentageTV = (TextView) findViewById(R.id.progress_percentage);
        messageTV = (TextView) findViewById(R.id.message);
        progressBar = (ProgressBar) findViewById(R.id.progress_bar);
        url = (EditText) findViewById(R.id.download_url);
        start = (Button) findViewById(R.id.start);
        pause = (Button) findViewById(R.id.pause);

        progressBar.setProgress(0);
        progressBar.setMax(100);
        progressBar.setIndeterminate(false);

        url.setText(urlStr);
        start.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                if (asytaskFinished &&
                        mDownloader.getStatus() != mDownloader.DOWNLOADING) {
                    initUrl();
                    startDownload();
                }
                message("status: " + mDownloader.getStatusStr());
            }
        });

        pause.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                if (mDownloader.getStatus() == mDownloader.DOWNLOADING) {
                    mDownloader.setStatus(mDownloader.PAUSE);
                    asyncTask.cancel(true);
                    message("paused & asyncTask is cancelled - " +
                            asyncTask.isCancelled());
                }
                message("status: " + mDownloader.getStatusStr());
            }
        });
    }

    private void initUrl() {
        urlStr = url.getText().toString();
        String file = urlStr.substring(urlStr.lastIndexOf("/") + 1);
        fileExtension = file.substring(file.lastIndexOf("."));
        filename = file.substring(0, file.lastIndexOf("."));
        message("file extension: " + fileExtension + "; file name: " +
                filename);
    }

    private void startDownload() {
        asytaskFinished = false;
        asyncTask = new AsyncTask<URL, Message, ResumableDownloader>() {

            protected ResumableDownloader doInBackground(URL... params) {
                try {
                    if (!fileDir.exists()) { fileDir.mkdirs();}
                    mDownloader.downloadFile(urlStr,
                            (new File(fileDir.getAbsolutePath(),
                                    filename + fileExtension))
                                    .getAbsolutePath(), new DownloadListener() {
                                public void progressUpdate(Message value) {
                                    publishProgress(value);
                                }
                            });
                } catch (FileNotFoundException e) {
                    message("File not found !");
                } catch (IOException e) {
                    e.printStackTrace();
                    mDownloader.setStatus(mDownloader.ERROR);
                    message(e.getMessage().substring(0, 50));
                }
                return mDownloader;
            }

            protected void onProgressUpdate(Message... values) {
                super.onProgressUpdate(values);
                int progress = (values[0]).getProgress();
                if (progress != 0) {
                    percentageTV.setText(
                            String.format("%1$" + 3 + "s", progress) + "%");
                    progressBar.setProgress(values[0].getProgress());
                }
                String msg = values[0].getMessage();
                if (msg != "") {
                    message(msg);
                }
            }

            protected void onPostExecute(ResumableDownloader o) {
                super.onPostExecute(o);
                message("Async task finished.");
                asytaskFinished = true;
            }

            protected void onCancelled() {
                super.onCancelled();
                message("async Task is cancelled: " + asyncTask.isCancelled());
                asytaskFinished = true;
            }
        }.execute();
    }

    private String msg;

    public void message(String message) {
        msg = message + "\n" + msg;
        while (msg.split("\n").length > 6) {
            msg = msg.substring(0, msg.lastIndexOf("\n"));
        }
        this.messageTV.setText(msg);
    }

    protected void onStop() {
        super.onStop();

        SharedPreferences settings = getSharedPreferences(PREFS_NAME, 0);
        SharedPreferences.Editor editor = settings.edit();
        editor.putString(PREFS_KEY_LASTMODIFIED, mDownloader.getLastModified());
        editor.putInt(PREFS_KEY_PROGRESS, progressBar.getProgress());
        editor.commit();
    }
}    
{% endhighlight %}

##Downloader
manage the download.

- downloadFile method will manage and download the file
- prepareDownload method which check the server and decide to do a new download or do a resume download.
- createConnection method to create connection, and notice the UI about what its doing.


{% highlight java %}
public class ResumableDownloader {
    /**
     * last modified time for file
     */
    private String lastModified;

    private int timeout;
    private File downloadedFile;
    private boolean startNewDownload;
    /**
     * total length of the file
     */
    private long fileLength = 0;

    // CONSTANT
    public static final int DOWNLOADING = 0;
    public static final int COMPLETE = 1;
    public static final int PAUSE = 2;
    public static final int ERROR = 3;
    public static final int BUFFER_SIZE = 8 * 1024;
    /**
     * downloading status: downloading; complete; pause; error;
     */
    private int status;
    private String[] statuses;

    public ResumableDownloader(String lastModified, int status) {
        this.lastModified = lastModified;
        timeout = 9000;
        startNewDownload = true;
        this.status = status;
        statuses = new String[]{"Downloading", "Complete", "Pause", "Error"};
    }

    /**
     * @param urlStr           downloadFile url
     * @param toFile           downloadedFile path
     * @param downloadListener downloadFile progress listener
     * @throws IOException
     */
    public void downloadFile(String urlStr, String toFile,
            DownloadListener downloadListener) throws IOException {
        prepareDownload(urlStr, toFile, downloadListener);
        HttpURLConnection connection =
                createConnection(urlStr, downloadListener);
        setStatus(DOWNLOADING);
        if (!startNewDownload) {
            connection.setRequestProperty("Range",
                    "bytes=" + downloadedFile.length() + "-");
        }
        downloadListener.progressUpdate(new Message(
                "ResponseCode: " + connection.getResponseCode() +
                        "; file length:" +
                        fileLength + "\nResponseMessage: " +
                        connection.getResponseMessage()));
        InputStream in = new BufferedInputStream(connection.getInputStream(),
                BUFFER_SIZE);
        FileOutputStream writer;
        long progressLength = 0;
        if (!startNewDownload) {
            progressLength += downloadedFile.length();
            downloadListener.progressUpdate(
                    new Message("resume download to: " + toFile));
            // append to exist downloadedFile
            writer = new FileOutputStream(toFile, true);
        } else {
            downloadListener
                    .progressUpdate(new Message("new download to: " + toFile));
            writer = new FileOutputStream(toFile);
            // save remote last modified data to local
            lastModified = connection.getHeaderField("Last-Modified");
        }
        try {
            byte[] buffer = new byte[BUFFER_SIZE];
            int count;
            while (getStatus() == DOWNLOADING &&
                    (count = in.read(buffer)) != -1) {
                progressLength += count;
                writer.write(buffer, 0, count);
                // progress....
                downloadListener.progressUpdate(
                        new Message((int) (progressLength * 100 / fileLength)));
                if (progressLength == fileLength) {
                    progressLength = 0;
                    setStatus(COMPLETE);
                }
            }
        } finally {
            writer.close();
            in.close();
            connection.disconnect();
        }
    }

    /**
     * rend a request to server & decide to start a new download or not
     *
     * @param urlStr           string url
     * @param toFile           to file path
     * @param downloadListener
     * @throws IOException
     */
    private void prepareDownload(String urlStr, String toFile,
            DownloadListener downloadListener) throws IOException {
        downloadListener
                .progressUpdate(new Message("prepare download ..........."));
        HttpURLConnection conn = createConnection(urlStr, downloadListener);
        downloadedFile = new File(toFile);
        String remoteLastModified = conn.getHeaderField("Last-Modified");
        fileLength = conn.getContentLength();

        startNewDownload = (!downloadedFile.exists() ||
                downloadedFile.length() >= fileLength ||
                !remoteLastModified.equalsIgnoreCase(lastModified));

        conn.disconnect();
        downloadListener.progressUpdate(new Message(
                "prepare finished .... start a new Download = " +
                        startNewDownload));
    }

    /**
     * @param urlStr           url string
     * @param downloadListener
     * @return An URLConnection for HTTP
     * @throws IOException
     */
    private HttpURLConnection createConnection(String urlStr,
            DownloadListener downloadListener) throws IOException {
        downloadListener
                .progressUpdate(new Message("create new connection ...."));
        URL url = new URL(urlStr);
        HttpURLConnection conn = (HttpURLConnection) url
                .openConnection(); // Open connection to URL.
        conn.setDoInput(true);
        conn.setDoOutput(true);
        conn.setReadTimeout(timeout);
        conn.setConnectTimeout(timeout);
        return conn;
    }
}    
{% endhighlight %}


##Message
Hold progress for progress bar and message for feedback infor and debug.
{% highlight java %}
public class Message {
    private Integer progress;
    private String message;

    public Message(Integer progress, String message) {
        this.progress = progress;
        this.message = message;
    }

    public Message(Integer progress) {
        this.progress = progress;
        this.message = "";
    }

    public Message(String message) {
        this.progress = 0;
        this.message = message;
    }

    public Integer getProgress() {
        return progress;
    }


    public String getMessage() {
        return message;
    }
}    
{% endhighlight %}


##DownloadListener
An interface to pass Message data

{% highlight java %}
public interface DownloadListener {
    /**
     * downloadFile progress value
     *
     * @param value
     */
    void progressUpdate(Message value);
}
{% endhighlight %}



{% highlight java %}

{% endhighlight %}



# References:

- [Byte serving](https://en.wikipedia.org/wiki/Byte_serving)


Source code [on Github](https://github.com/junjunguo/android/tree/master/2015/ResumeDownload)