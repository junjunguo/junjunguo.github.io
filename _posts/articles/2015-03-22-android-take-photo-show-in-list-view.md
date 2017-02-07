---
layout: post
title: Android take photo and save to gallery, choose photo from gallery and show in ListView
excerpt: take photo or choose from gallery and use adapter to fill data from ArrayList to ListView
categories: articles
tags: [Android, code, GUI, Java, Mobile]
image:
  feature: summer2014-112.jpg
  credit: GuoJunjun
  creditlink: https://junjunguo.github.io
comments: true
share: true
---

# Contents
{:.no_toc}

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# About

The following will be implemented in this tutorial:

- ListView in main window which include:
    - `ImageAdapter` extends from an ArrayAdapter: which is used to populating data from ArrayList to ListView.
        -  A ViewHolder pattern is used to speed up ListView, smoother and faster item loading.
        - `ThumbnailUtils` is used to build a Thumbnail for list view.
    - custom `item_image.xml` to create a custom item view for ListView: Thumbnail at left side and description at the
    right side.
- Use Dialog to build a Dialog box (popup window):
    - user can choose take a photo (will be saved in gallery folder, and add Thumbnail, image information and image path
     to ListView).
    - user can choose existing photo from gallery to ListView.
- A MyImage class to hold image information

## screen capture
Here is how it looks when it is done:

![TableLayout](https://raw.githubusercontent.com/junjunguo/android/master/2015/ImageAdaptertoListView/main.png)

![TableLayout](https://raw.githubusercontent.com/junjunguo/android/master/2015/ImageAdaptertoListView/dialog.png)

![TableLayout](https://raw.githubusercontent.com/junjunguo/android/master/2015/ImageAdaptertoListView/gallery.png)

![TableLayout](https://raw.githubusercontent.com/junjunguo/android/master/2015/ImageAdaptertoListView/image.png)

![TableLayout](https://raw.githubusercontent.com/junjunguo/android/master/2015/ImageAdaptertoListView/listview.png)


# Main Activity

- create MyImage and fill with data
- add MyImage to ArrayList
- A ListView is used to show a vertical list of scrollable items
- ArrayAdapter is used to converts an ArrayList of objects into view items loaded into the ListView container.
- Use Dialog to build a popup window:
    - active take a photo:
        - deals with: taking pictures with camera in android.
        - will move to take photo view (photo be saved in gallery folder, and add Thumbnail, image information and
        image path to ListView).
    - active from gallery:
        - deals with: How to pick an image from gallery for app to use?
        - choose existing photo from android image gallery and show thumbnail and image path + image information to
        ListView.

{% highlight java %}
public class MainActivity extends ActionBarActivity {

    private ArrayList<MyImage> images;
    private ImageAdapter imageAdapter;
    private ListView listView;
    private Uri mCapturedImageURI;
    private static final int RESULT_LOAD_IMAGE = 1;
    private static final int REQUEST_IMAGE_CAPTURE = 2;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Construct the data source
        images = new ArrayList();
        // Create the adapter to convert the array to views
        imageAdapter = new ImageAdapter(this, images);
        // Attach the adapter to a ListView
        listView = (ListView) findViewById(R.id.main_list_view);
        listView.setAdapter(imageAdapter);
    }

    public void btnAddOnClick(View view) {
        final Dialog dialog = new Dialog(this);
        dialog.setContentView(R.layout.custom_dialog_box);
        dialog.setTitle("Alert Dialog View");
        Button btnExit = (Button) dialog.findViewById(R.id.btnExit);
        btnExit.setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                dialog.dismiss();
            }
        });
        dialog.findViewById(R.id.btnChoosePath)
                .setOnClickListener(new View.OnClickListener() {
                    @Override public void onClick(View v) {
                        activeGallery();
                    }
                });
        dialog.findViewById(R.id.btnTakePhoto)
                .setOnClickListener(new View.OnClickListener() {
                    @Override public void onClick(View v) {
                        activeTakePhoto();
                    }
                });

        // show dialog on screen
        dialog.show();
    }

    /**
     * take a photo
     */
    private void activeTakePhoto() {
        Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        if (takePictureIntent.resolveActivity(getPackageManager()) != null) {
            String fileName = "temp.jpg";
            ContentValues values = new ContentValues();
            values.put(MediaStore.Images.Media.TITLE, fileName);
            mCapturedImageURI = getContentResolver()
                    .insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                            values);
            takePictureIntent
                    .putExtra(MediaStore.EXTRA_OUTPUT, mCapturedImageURI);
            startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAPTURE);
        }
    }

    /**
     * to gallery
     */
    private void activeGallery() {
        Intent intent = new Intent(Intent.ACTION_PICK,
                android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        startActivityForResult(intent, RESULT_LOAD_IMAGE);
    }

    @Override protected void onActivityResult(int requestCode, int resultCode,
            Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            case RESULT_LOAD_IMAGE:
                if (requestCode == RESULT_LOAD_IMAGE &&
                        resultCode == RESULT_OK && null != data) {
                    Uri selectedImage = data.getData();
                    String[] filePathColumn = {MediaStore.Images.Media.DATA};
                    Cursor cursor = getContentResolver()
                            .query(selectedImage, filePathColumn, null, null,
                                    null);
                    cursor.moveToFirst();
                    int columnIndex = cursor.getColumnIndex(filePathColumn[0]);
                    String picturePath = cursor.getString(columnIndex);
                    cursor.close();
                    MyImage image = new MyImage();
                    image.setTitle("Test");
                    image.setDescription(
                            "test choose a photo from gallery and add it to " +
                                    "list view");
                    image.setDatetime(System.currentTimeMillis());
                    image.setPath(picturePath);
                    images.add(image);
                }
            case REQUEST_IMAGE_CAPTURE:
                if (requestCode == REQUEST_IMAGE_CAPTURE &&
                        resultCode == RESULT_OK) {
                    String[] projection = {MediaStore.Images.Media.DATA};
                    Cursor cursor =
                            managedQuery(mCapturedImageURI, projection, null,
                                    null, null);
                    int column_index_data = cursor.getColumnIndexOrThrow(
                            MediaStore.Images.Media.DATA);
                    cursor.moveToFirst();
                    String picturePath = cursor.getString(column_index_data);
                    MyImage image = new MyImage();
                    image.setTitle("Test");
                    image.setDescription(
                            "test take a photo and add it to list view");
                    image.setDatetime(System.currentTimeMillis());
                    image.setPath(picturePath);
                    images.add(image);
                }
        }
    }
}
{% endhighlight %}


# ImageAdapter

- A ViewHolder pattern is used to speed up ListView, smoother and faster item loading.
- `ThumbnailUtils` is used to build a Thumbnail for list view.

{% highlight java %}
public class ImageAdapter extends ArrayAdapter<MyImage> {

    /**
     * applying ViewHolder pattern to speed up ListView, smoother and faster
     * item loading by caching view in A ViewHolder object
     */
    private static class ViewHolder {
        ImageView imgIcon;
        TextView description;
    }

    public ImageAdapter(Context context, ArrayList<MyImage> images) {
        super(context, 0, images);
    }

    @Override public View getView(int position, View convertView,
            ViewGroup parent) {
        // view lookup cache stored in tag
        ViewHolder viewHolder;
        // Check if an existing view is being reused, otherwise inflate the
        // item view
        if (convertView == null) {
            viewHolder = new ViewHolder();
            convertView = LayoutInflater.from(getContext())
                    .inflate(R.layout.item_image, parent, false);
            viewHolder.description =
                    (TextView) convertView.findViewById(R.id.item_img_infor);
            viewHolder.imgIcon =
                    (ImageView) convertView.findViewById(R.id.item_img_icon);
            convertView.setTag(viewHolder);
        } else {
            viewHolder = (ViewHolder) convertView.getTag();
        }
        // Get the data item for this position
        MyImage image = getItem(position);
        // set description text
        viewHolder.description.setText(image.toString());
        // set image icon
        final int THUMBSIZE = 96;
        //        viewHolder.imgIcon.setImageURI(Uri.fromFile(new File(image
        // .getPath())));
        viewHolder.imgIcon.setImageBitmap(ThumbnailUtils
                .extractThumbnail(BitmapFactory.decodeFile(image.getPath()),
                        THUMBSIZE, THUMBSIZE));

        // Return the completed view to render on screen
        return convertView;
    }
}
{% endhighlight %}


# MyImage

holder image's information.

{% highlight java %}
public class MyImage {
    private String title, description, path;
    private Calendar datetime;
    private long datetimeLong;
    protected SimpleDateFormat df = new SimpleDateFormat("MMMM d, yy  h:mm");

    /**
     * Gets title.
     *
     * @return Value of title.
     */
    public String getTitle() { return title; }

    /**
     * Gets datetime.
     *
     * @return Value of datetime.
     */
    public Calendar getDatetime() { return datetime; }

    /**
     * Sets new datetimeLong.
     *
     * @param datetimeLong New value of datetimeLong.
     */
    public void setDatetime(long datetimeLong) {
        this.datetimeLong = datetimeLong;
        Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(datetimeLong);
        this.datetime = cal;
    }

    /**
     * Sets new datetime.
     *
     * @param datetime New value of datetime.
     */
    public void setDatetime(Calendar datetime) { this.datetime = datetime; }

    /**
     * Gets description.
     *
     * @return Value of description.
     */
    public String getDescription() { return description; }

    /**
     * Sets new title.
     *
     * @param title New value of title.
     */
    public void setTitle(String title) { this.title = title; }

    /**
     * Gets datetimeLong.
     *
     * @return Value of datetimeLong.
     */
    public long getDatetimeLong() { return datetimeLong; }

    /**
     * Sets new description.
     *
     * @param description New value of description.
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * Sets new path.
     *
     * @param path New value of path.
     */
    public void setPath(String path) { this.path = path; }

    /**
     * Gets path.
     *
     * @return Value of path.
     */
    public String getPath() { return path; }

    @Override public String toString() {
        return "Title:" + title + "   " + df.format(datetime.getTime()) +
                "\nDescription:" + description + "\nPath:" + path;
    }
}
{% endhighlight %}

# `MainActivity xml`

`layout/activity_main.xml` has a TextView and a Button to active Alert Dialog window:

{% highlight xml %}
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
              xmlns:tools="http://schemas.android.com/tools"
              android:layout_width="match_parent"
              android:layout_height="match_parent"
              android:orientation="vertical"
              tools:context=".MainActivity">

    <Button
        android:layout_width="match_parent"
        android:layout_height="50dp"
        android:background="@color/deepPurple4"
        android:textColor="@color/white"
        android:id="@+id/btnAdd"
        android:onClick="btnAddOnClick"
        android:text="@string/add_image"/>

    <ListView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:id="@+id/main_list_view"
        android:cacheColorHint="@color/deepPurple1">
    </ListView>

</LinearLayout>
{% endhighlight %}

# `Custom dialog Layout`

`layout/custom_dialog_box.xml` defines the outlook of Alert Dialog window, which contains:

- take photo button
- choose image from gallery button
- and an exit button

{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
                android:layout_width="fill_parent"
                android:background="@color/deepPurple5"
                android:paddingLeft="@dimen/activity_horizontal_margin"
                android:paddingRight="@dimen/activity_horizontal_margin"
                android:paddingTop="@dimen/activity_vertical_margin"
                android:paddingBottom="@dimen/activity_vertical_margin"
                android:layout_height="fill_parent">

    <Button
        android:onClick="btnChoosePathClicked"
        android:id="@+id/btnChoosePath"
        android:background="@color/deepPurple1"
        android:textColor="@color/deepPurple5"
        android:layout_centerHorizontal="true"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginBottom="20dp"
        android:width="200dp"
        android:text="From Gallery"/>

    <Button
        android:onClick="btnTakePhotoClicked"
        android:id="@+id/btnTakePhoto"
        android:background="@color/deepPurple2"
        android:textColor="@color/deepPurple5"
        android:layout_centerHorizontal="true"
        android:layout_below="@id/btnChoosePath"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginBottom="20dp"
        android:width="200dp"
        android:text="Take Photo"/>

    <Button
        android:onClick="btnExitClicked"
        android:id="@+id/btnExit"
        android:background="@color/deepPurple4"
        android:textColor="@color/black"
        android:layout_centerHorizontal="true"
        android:layout_below="@id/btnTakePhoto"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:width="200dp"
        android:text="Exit"/>
</RelativeLayout>
{% endhighlight %}

# `Custom item Layout`

`item_image.xml` customize item row in ListView.

{% highlight xml%}
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
              android:orientation="horizontal"
              android:background="@color/deepPurple5"
              android:layout_width="match_parent"
              android:layout_height="match_parent">

    <ImageView
        android:id="@+id/item_img_icon"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:src="@drawable/ic_launcher"
        android:padding="5dp"
        android:layout_marginRight="10dp"/>

    <TextView
        android:id="@+id/item_img_infor"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/image_information"
        android:textColor="@color/deepPurple1"
        android:padding="5dp"
        android:layout_marginLeft="10dp"/>
</LinearLayout>
{% endhighlight %}

# `strings.xml`
The `strings.xml` in `values`:

{% highlight xml %}
<resources>
    <string name="app_name">image adapter to listview</string>
    <string name="action_settings">Settings</string>
    <string name="add_image">Add Image</string>
    <string name="title_activity_display_image">DisplayImage</string>
    <string name="image_information">Image Information</string>
</resources>
{% endhighlight %}

# `colors.xml`
The deep purple style colors in `values/colors.xml`:

{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="deepPurple1">#311B92</color>
    <color name="deepPurple2">#512DA8</color>
    <color name="deepPurple3">#673AB7</color>
    <color name="deepPurple4">#9575CD</color>
    <color name="deepPurple5">#D1C4E9</color>
    <color name="black">#000</color>
    <color name="white">#fff</color>
</resources>
{% endhighlight %}

# References:

- http://developer.android.com/reference/android/widget/ArrayAdapter.html
- http://developer.android.com/training/improving-layouts/smooth-scrolling.html
- https://github.com/codepath/android_guides/wiki/Using-an-ArrayAdapter-with-ListView
- http://developer.android.com/training/camera/photobasics.html
- http://developer.android.com/reference/android/media/ThumbnailUtils.html

Source code [on Github](https://github.com/junjunguo/android/tree/master/2015/ImageAdaptertoListView)

