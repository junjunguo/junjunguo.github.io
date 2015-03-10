---
layout: post
title: Android use AsyncTask or Executor to repeat tasks in background
excerpt: "How to repeatedly do tasks with AsyncTask or Executor"
categories: articles
tags: [Android, code, Java, Thread, Mobile]
image:
  feature: summer2014-120.jpg
  credit: GuoJunjun
  creditlink: http://junjunguo.com/main.html
comments: true
share: true
---

We often need to do some tasks in background periodically, this tutorial describes three methods to do tasks periodically. 

# Contents
{:.no_toc}

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# Run tasks repeatedly

There are many ways to run tasks repeatedly in Android, here we use Timer and TimerTask to repeat our tasks. And to execute the tasks, the following tutorial will show three methods:

* Use `runOnUiThread` to run the tasks
* Extends `AsyncTask` and run the tasks in an extended Class
* Implements `Executor` and write constraints in the implemented Class

This is how it looks when it is done:

![screenshot](https://raw.githubusercontent.com/junjunguo/android/master/2015/RepeatAsyncTask/asyn.png)

![screenshot](https://raw.githubusercontent.com/junjunguo/android/master/2015/RepeatAsyncTask/executor.png)

and the Log.i view:

> 03-10 11:11:03.046  I/Executor Perform﹕ <~~~~~~~~~ Text from Background Perform
>
> 03-10 11:11:05.046  I/Background Perform﹕ -------> Text from Background Perform


> the example code is built with Android Studio; Minimum Sdk Version: 11; Target Sdk Version 21.


## `runOnUiThread` 

Use `runOnUiThread` can allow use manipulate the UI. The following code change the `TextView` and `EditText` ‘s color and contents, run the `timerTaskAsync` every 4 seconds (4000 ms) without any delay (0 ms).

{% highlight java %}
timerAsync = new Timer();
timerTaskAsync = new TimerTask() {
    @Override
    public void run() {
        runOnUiThread(new Runnable() {
            @Override public void run() {
                Log.i("Background Perform",
                        "-------> Text from Background Perform");
                textView.setText("Text from Background Perform");
                textView.setBackgroundColor(Color.YELLOW);
                editText.setText("Text from Background Perform");
                editText.setBackgroundColor(Color.CYAN);
            }
        });
    }
};
timerAsync.schedule(timerTaskAsync, 0, 4000);
{% endhighlight %}
This is how the method simply execute our task periodically. 

# `Executor`
The second method implements Executor to execute the task. 

## Implements `Executor`
Create a class and implements `Executor`. The following code will execute the task only if there is internet available. 
{% highlight java %}
public class BackgroundPerformExecutor implements Executor {
    private Context context;

    public BackgroundPerformExecutor(Context context) {
        this.context = context;
    }

    @Override public void execute(Runnable command) {
        if (isOnline()) {
            command.run();
        }
    }

    public boolean isOnline() {
        ConnectivityManager cm = (ConnectivityManager) context
                .getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo netInfo = cm.getActiveNetworkInfo();
        return netInfo != null && netInfo.isConnectedOrConnecting();
    }
}
{% endhighlight %}
We pass Context from the calling Activity then we can check if the internet is available, and we need to add network access permission in `AndroidManifest`: 

{% highlight xml %}
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
{% endhighlight %}

## Execute task with `Executor`
With `Executor` we can easily manipulate the UI, the following code will change the `TextView` and `EditText` ‘s color and content every 4 seconds (4000 ms) and with 2 seconds delay (2000 ms). In Use `runOnUiThread` method, we change the text color and contents every 4 seconds without delay, so the text color and contents will change every 2 seconds after the method is implemented. 

{% highlight java %}
private Timer timerExecutor = new Timer();
private TimerTask doAsynchronousTaskExecutor;

public void startBackgroundPerformExecutor() {
    final Handler handler = new Handler();
    doAsynchronousTaskExecutor = new TimerTask() {
        @Override
        public void run() {
            handler.post(new Runnable() {
                public void run() {
                    try {
                        BackgroundPerformExecutor performBackgroundTask =
                                new BackgroundPerformExecutor(
                                        getApplicationContext());
                        performBackgroundTask.execute(new Runnable() {
                            @Override public void run() {
                                Log.i("Executor Perform",
                                        "<~~~~~~~~~ Text from Background " +
                                                "Perform");
                                textView.setText(
                                        "Text from Background Perform " +
                                                "Executor");
                                textView.setBackgroundColor(Color.RED);
                                editText.setText(
                                        "Text from Background Perform " +
                                                "Executor");
                                editText.setBackgroundColor(Color.MAGENTA);
                                Toast.makeText(getApplicationContext(),
                                        "Text from Background Perform " +
                                                "Executor",
                                        Toast.LENGTH_SHORT).show();
                            }
                        });
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });
        }
    };
    timerExecutor.schedule(doAsynchronousTaskExecutor, 2000, 4000);
}
{% endhighlight %}

## Stop the task
The task will not stop, even on `onDestroy`, the task will still run in the background. We can call `cancel` to stop the task. The following code show how to stop it by a button.
{% highlight java %}
public void stopExecutorClicked(View view) {
    Toast.makeText(this, "stop Executor clicked !", Toast.LENGTH_SHORT).show();
    doAsynchronousTaskExecutor.cancel();
    timerExecutor.cancel();
}
{% endhighlight %}

If you need the tasks stop when `onDestroy` is called override the `onDestroy`:
{% highlight java %}
    @Override protected void onDestroy() {
        super.onDestroy();
        doAsynchronousTaskExecutor.cancel();
        timerExecutor.cancel();
    }
{% endhighlight %}

# `AsyncTask`
> AsyncTask is ideally used for short operations (a few seconds at the most).

If the threads need to keep running for a long periods of time `Executor` would be better for the purpose. 
An asyncTask have to be subclassed to be in used. 
## extends `AsyncTask`
{% highlight java %}
 public class BackgroundPerformAsyncTask extends AsyncTask {
    private Context context;

    public BackgroundPerformAsyncTask(Context context) {
        this.context = context;
    }

    @Override protected Object doInBackground(Object[] params) {
        //run tasks her ...
        if (isOnline()) {
            Log.i("Async", "-------> Text from BackgroundPerformAsyncTask");
        }
        return null;
    }

    /**
     * @return true if internet available
     */
    public boolean isOnline() {
        ConnectivityManager cm = (ConnectivityManager) context
                .getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo netInfo = cm.getActiveNetworkInfo();
        return netInfo != null && netInfo.isConnectedOrConnecting();
    }
}
{% endhighlight %}

## Run `AsyncTask`
The following method shows how to periodically run an AsyncTask:
{% highlight java %}
    private Timer timerAsync;
    private TimerTask timerTaskAsync;
    public void startBackgroundPerform() {
        final Handler handler = new Handler();
        timerAsync = new Timer();
        timerTaskAsync = new TimerTask() {
            @Override
            public void run() {
                handler.post(new Runnable() {
                    public void run() {
                        try {
                            BackgroundPerformAsyncTask performBackgroundTask =
                                    new BackgroundPerformAsyncTask(
                                            getApplicationContext());
                            performBackgroundTask.execute();
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                                });
            }
        };
        timerAsync.schedule(timerTaskAsync, 0, 4000);
    }
{% endhighlight %}
Stop AsyncTask is the same as stop Executor, call `cancle` in Timer and TimerTask.

# The layout
{% highlight xml %}
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
                xmlns:tools="http://schemas.android.com/tools"
                android:layout_width="match_parent"
                android:layout_height="match_parent"
                android:paddingLeft="@dimen/activity_horizontal_margin"
                android:paddingRight="@dimen/activity_horizontal_margin"
                android:paddingTop="@dimen/activity_vertical_margin"
                android:paddingBottom="@dimen/activity_vertical_margin"
                tools:context=".MainActivity">

    <TextView
        android:text="@string/hello_world"
        android:id="@+id/text_view"
        android:layout_centerHorizontal="true"
        android:gravity="center"
        android:padding="5dp"
        android:layout_marginBottom="5dp"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"/>

    <EditText
        android:layout_width="match_parent"
        android:layout_below="@+id/text_view"
        android:gravity="center"
        android:id="@+id/edit_text"
        android:layout_centerHorizontal="true"
        android:layout_height="wrap_content"/>

    <Button
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:id="@+id/executor_stop_btn"
        android:layout_below="@+id/edit_text"
        android:layout_marginTop="30dp"
        android:width="200dp"
        android:text="stop Executor"
        android:onClick="stopExecutorClicked"
        android:layout_centerHorizontal="true"/>

    <Button
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:id="@+id/asyntask_stop_btn"
        android:layout_below="@+id/executor_stop_btn"
        android:layout_marginTop="30dp"
        android:width="200dp"
        android:text="stop Asyntask"
        android:onClick="stopAsyntaskClicked"
        android:layout_centerHorizontal="true"/>
</RelativeLayout>
{% endhighlight %}

# The MainActivity Class
{% highlight java %}
public class MainActivity extends ActionBarActivity {
    private TextView textView;
    private EditText editText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        textView = (TextView) findViewById(R.id.text_view);
        editText = (EditText) findViewById(R.id.edit_text);
        startBackgroundPerform();
        startBackgroundPerformExecutor();
    }

    private Timer timerExecutor = new Timer();
    private TimerTask doAsynchronousTaskExecutor;

    public void startBackgroundPerformExecutor() {
        final Handler handler = new Handler();
        doAsynchronousTaskExecutor = new TimerTask() {
            @Override
            public void run() {
                handler.post(new Runnable() {
                    public void run() {
                        try {
                            BackgroundPerformExecutor performBackgroundTask =
                                    new BackgroundPerformExecutor(
                                            getApplicationContext());
                            performBackgroundTask.execute(new Runnable() {
                                @Override public void run() {
                                    Log.i("Executor Perform",
                                            "<~~~~~~~~~ Text from Background " +
                                                    "Perform");
                                    textView.setText(
                                            "Text from Background Perform " +
                                                    "Executor");
                                    textView.setBackgroundColor(Color.RED);
                                    editText.setText(
                                            "Text from Background Perform " +
                                                    "Executor");
                                    editText.setBackgroundColor(Color.MAGENTA);
                                    Toast.makeText(getApplicationContext(),
                                            "Text from Background Perform " +
                                                    "Executor",
                                            Toast.LENGTH_SHORT).show();
                                }
                            });
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                });
            }
        };
        timerExecutor.schedule(doAsynchronousTaskExecutor, 2000, 4000);
    }

    public void stopExecutorClicked(View view) {
        Toast.makeText(this, "stop Executor clicked !", Toast.LENGTH_SHORT)
                .show();
        doAsynchronousTaskExecutor.cancel();
        timerExecutor.cancel();
    }

    private Timer timerAsync;
    private TimerTask timerTaskAsync;

    public void startBackgroundPerform() {
        final Handler handler = new Handler();
        timerAsync = new Timer();
        timerTaskAsync = new TimerTask() {
            @Override
            public void run() {
                runOnUiThread(new Runnable() {
                    @Override public void run() {
                        Log.i("Background Perform",
                                "-------> Text from Background Perform");
                        textView.setText("Text from Background Perform");
                        textView.setBackgroundColor(Color.YELLOW);
                        editText.setText("Text from Background Perform");
                        editText.setBackgroundColor(Color.CYAN);
                    }
                });
                //                handler.post(new Runnable() {
                //                    public void run() {
                //                        try {
                //                            BackgroundPerformAsyncTask
                // performBackgroundTask =
                //                                    new
                // BackgroundPerformAsyncTask(
                //
                // getApplicationContext());
                //                            performBackgroundTask.execute();
                //                        } catch (Exception e) {
                //                            e.printStackTrace();
                //                        }
                //                    }
                //                                });
            }
        };
        timerAsync.schedule(timerTaskAsync, 0, 4000);
    }

    public void stopAsyntaskClicked(View view) {
        Toast.makeText(this, "stop asyn task clicked !", Toast.LENGTH_SHORT)
                .show();
        timerAsync.cancel();
        timerTaskAsync.cancel();
    }

    @Override protected void onDestroy() {
        super.onDestroy();
        doAsynchronousTaskExecutor.cancel();
        timerExecutor.cancel();
    }
}
{% endhighlight %}

And we have our project implemented.

Source code [on Github](https://github.com/junjunguo/android/tree/master/2015/SendMessagetoOtherActivity)

