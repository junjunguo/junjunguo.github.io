---
layout: post
title: Android ListView Image save data in SQLite Database
excerpt: Choose Image from Gallery or Camera, display in a ListView and save information in SQLite

categories: blog
tags: [Android, code, GUI, Java, Mobile, SQLite, Database, XML, image]
image:
  feature: 14786764996_9633596f4e_o.jpg
  credit: GuoJunjun
  creditlink: http://junjunguo.com
comments: true
share: true
---

# Contents
{:.no_toc}

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# About

- How to create a ListView and use custom item layout in each ListView row?
- How to show a Thumbnail with description in each ListView's item?
- How to show a image in full screen when the Thumbnail is clicked in ListView?
- How to create a popup window for options choose?
- How to choose a image from gallery and use it in the app?
- How to take a photo and use the photo in the app?
- How to use SQLite Database to save information?

## Structure
All will be answered and implemented as following structure:

### View & Controller

- create a ListView in main window which include:
    - `ThumbnailUtils` is used to build a Thumbnail for list view.
    - custom `item_image.xml` to create a custom item view for ListView: Thumbnail at left side and description at the
    right side.
- Use Dialog to build a Dialog box (popup window):
    - option 1: take a photo (photo will be saved in gallery folder, and add Thumbnail, image information and image
    path to ListView).
    - option 2: choose existing photo from gallery.
- create a ImageView window (`DisplayImage`) to show image in full screen.
    - a delete function to delete image from ListView and database.
    - a back button to return ListView.
    - a transparent background description text on top of the screen.

### Model

- create a `MyImage` class to hold image information
- `ImageAdapter` extends from an ArrayAdapter: which is used to populating data from ArrayList to ListView.
    -  A ViewHolder pattern is used to speed up ListView, smoother and faster item loading.
- `ImageResizer`: used to resize the image.
    - a image size can be large, it is wise to load a scaled down version image into memory.
        - which can increase performance
        - reduce the chance that system out of memory and app crash.
- `DBhelper`: A helper class to manage database creation and version management.
- `DAOdb`: a Data Access Object.
    - add, delete ... query data operations without exposing details of the database.


## screen captures

Main view when start

![screen captures](https://raw.githubusercontent.com/junjunguo/android/master/2015/SqliteImage/main.png)

Popup window for options

![screen captures](https://raw.githubusercontent.com/junjunguo/android/master/2015/SqliteImage/dialog.png)

ListView in main window: Portrait View

![screen captures](https://raw.githubusercontent.com/junjunguo/android/master/2015/SqliteImage/listp.png)

ImageView in image view window: Portrait View

![screen captures](https://raw.githubusercontent.com/junjunguo/android/master/2015/SqliteImage/imagep.png)

ListView in main window: Landscape View

![screen captures](https://raw.githubusercontent.com/junjunguo/android/master/2015/SqliteImage/listl.png)

ImageView in image view window: Landscape View

![screen captures](https://raw.githubusercontent.com/junjunguo/android/master/2015/SqliteImage/imagel.png)

Popup window for options: choose photo from gallery, Landscape View

![screen captures](https://raw.githubusercontent.com/junjunguo/android/master/2015/SqliteImage/galleryl.png)


# Main Activity

- create a DAOdb object
- load data from database
- create MyImage and fill with data
- add MyImage to ArrayList
- A ListView is used to show a vertical list of scrollable items
- ArrayAdapter is used to converts an ArrayList of objects into view items loaded into the ListView container.
- Use Dialog to build a popup window:
    - active take a photo:
        - deals with: taking pictures with camera in android.
        - will move to take photo view (photo be saved in gallery folder, and add Thumbnail, image information and
        image path to ListView).
        - save data in database
    - active from gallery:
        - deals with: How to pick an image from gallery for app to use?
        - choose existing photo from android image gallery and show thumbnail and image path + image information to
        ListView.
        - save data in database
- ItemClickListener: used to switch screen to `DisplayImage` window
    - send image object as JSON string to Display Image window
- save instance state: save "captured image uri"
- restore instance state: when screen rotated ...
    - when screen rotated at taking photo process, activity is on onCreate lifecycle, which will be build again, so
    we need to get the "captured image uri" information from last process.
    - application crashes if it can not get this information.

{% highlight java %}
public class MainActivity extends ActionBarActivity {

    private ArrayList<MyImage> images;
    private ImageAdapter imageAdapter;
    private ListView listView;
    private Uri mCapturedImageURI;
    private static final int RESULT_LOAD_IMAGE = 1;
    private static final int REQUEST_IMAGE_CAPTURE = 2;
    private DAOdb daOdb;

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
        addItemClickListener(listView);
        initDB();
    }

    /**
     * initialize database
     */
    private void initDB() {
        daOdb = new DAOdb(this);
        //        add images from database to images ArrayList
        for (MyImage mi : daOdb.getImages()) {
            images.add(mi);
        }
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
                    daOdb.addImage(image);
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
                    daOdb.addImage(image);
                }
        }
    }

    /**
     * item clicked listener used to implement the react action when an item is
     * clicked.
     *
     * @param listView
     */
    private void addItemClickListener(final ListView listView) {
        listView.setOnItemClickListener(new OnItemClickListener() {
            @Override public void onItemClick(AdapterView<?> parent, View view,
                    int position, long id) {

                MyImage image = (MyImage) listView.getItemAtPosition(position);
                Intent intent =
                        new Intent(getBaseContext(), DisplayImage.class);
                intent.putExtra("IMAGE", (new Gson()).toJson(image));
                startActivity(intent);
            }
        });
    }

    @Override protected void onSaveInstanceState(Bundle outState) {
        // Save the user's current game state
        if (mCapturedImageURI != null) {
            outState.putString("mCapturedImageURI",
                    mCapturedImageURI.toString());
        }
        // Always call the superclass so it can save the view hierarchy state
        super.onSaveInstanceState(outState);
    }

    @Override protected void onRestoreInstanceState(Bundle savedInstanceState) {
        // Always call the superclass so it can restore the view hierarchy
        super.onRestoreInstanceState(savedInstanceState);

        // Restore state members from saved instance
        if (savedInstanceState.containsKey("mCapturedImageURI")) {
            mCapturedImageURI = Uri.parse(
                    savedInstanceState.getString("mCapturedImageURI"));
        }
    }
}
{% endhighlight %}

# DisplayImage
Display the selected item's image in full screen.
- use: save instance and restore instance to handle screen rotation ...
- restore image object from JSON string.
    - use the image information to show the selected image and its description.
- use `ImageResizer` to resize the image

{% highlight java %}
public class DisplayImage extends Activity {
    private MyImage image;
    private ImageView imageView;
    private TextView description;
    private String jstring;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_display_image);
        imageView = (ImageView) findViewById(R.id.display_image_view);
        description = (TextView) findViewById(R.id.text_view_description);
        Bundle extras = getIntent().getExtras();

        if (extras != null) {
            jstring = extras.getString("IMAGE");
        }
        image = getMyImage(jstring);
        description.setText(image.toString());
        Display display = getWindowManager().getDefaultDisplay();
        Point size = new Point();
        display.getSize(size);
        int width = size.x;
        int height = size.y;
        imageView.setImageBitmap(ImageResizer
                .decodeSampledBitmapFromFile(image.getPath(), width, height));
    }

    private MyImage getMyImage(String image) {
        try {
            JSONObject job = new JSONObject(image);
            return (new MyImage(job.getString("title"),
                    job.getString("description"), job.getString("path"),
                    job.getLong("datetimeLong")));
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * go back to main activity
     *
     * @param v
     */
    public void btnBackOnClick(View v) {
        startActivity(new Intent(this, MainActivity.class));
        finish();
    }

    /**
     * delete the current item;
     *
     * @param v
     */
    public void btnDeleteOnClick(View v) {
        DAOdb db = new DAOdb(this);
        db.deleteImage(image);
        db.close();
        startActivity(new Intent(this, MainActivity.class));
        finish();
    }

    @Override protected void onSaveInstanceState(Bundle outState) {
        // Save the user's current game state
        if (jstring != null) {
            outState.putString("jstring", jstring);
        }
        // Always call the superclass so it can save the view hierarchy state
        super.onSaveInstanceState(outState);
    }

    @Override protected void onRestoreInstanceState(Bundle savedInstanceState) {
        // Always call the superclass so it can restore the view hierarchy
        super.onRestoreInstanceState(savedInstanceState);

        // Restore state members from saved instance
        if (savedInstanceState.containsKey("jstring")) {
            jstring = savedInstanceState.getString("jstring");
        }
    }
}
{% endhighlight %}


# ImageResizer
resize images by give a target width and height. Useful for when the input images might be too large to simply load
directly into memory.

{% highlight java %}
public class ImageResizer {

    /**
     * Calculate an inSampleSize for use in a {@link android.graphics
     * .BitmapFactory.Options} object when decoding bitmaps using the decode*
     * methods from {@link android.graphics.BitmapFactory}. This implementation
     * calculates the closest inSampleSize that is a power of 2 and will result
     * in the final decoded bitmap having a width and height equal to or larger
     * than the requested width and height.
     *
     * @param options   An options object with out* params already populated
     *                  (run through a decode* method with
     *                  inJustDecodeBounds==true
     * @param reqWidth  The requested width of the resulting bitmap
     * @param reqHeight The requested height of the resulting bitmap
     * @return The value to be used for inSampleSize
     */
    public static int calculateInSampleSize(BitmapFactory.Options options,
            int reqWidth, int reqHeight) {
        // Raw height and width of image
        final int height = options.outHeight;
        final int width = options.outWidth;
        int inSampleSize = 1;

        if (height > reqHeight || width > reqWidth) {
            final int halfHeight = height / 2;
            final int halfWidth = width / 2;

            // Calculate the largest inSampleSize value that is a power of 2
            // and keeps both height and width larger than the requested
            // height and width.
            while ((halfHeight / inSampleSize) > reqHeight &&
                    (halfWidth / inSampleSize) > reqWidth) {
                inSampleSize *= 2;
            }
        }
        return inSampleSize;
    }

    /**
     * Decode and sample down a bitmap from a file to the requested width and
     * height.
     *
     * @param filename  The full path of the file to decode
     * @param reqWidth  The requested width of the resulting bitmap
     * @param reqHeight The requested height of the resulting bitmap
     * @return A bitmap sampled down from the original with the same aspect
     * ratio and dimensions that are equal to or greater than the requested
     * width and height
     */
    public static Bitmap decodeSampledBitmapFromFile(String filename,
            int reqWidth, int reqHeight) {

        // First decode with inJustDecodeBounds=true to check dimensions
        final BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        BitmapFactory.decodeFile(filename, options);

        // Calculate inSampleSize
        options.inSampleSize =
                calculateInSampleSize(options, reqWidth, reqHeight);

        // Decode bitmap with inSampleSize set
        options.inJustDecodeBounds = false;
        return BitmapFactory.decodeFile(filename, options);
    }
}
{% endhighlight %}

# ImageAdapter
ArrayAdapter is used to converts an ArrayList of objects into view items loaded into the ListView container.

- A ViewHolder pattern is used to speed up ListView, smoother and faster item loading.
- `ThumbnailUtils` is used to build a Thumbnail for list view.

{% highlight java %}
public class ImageAdapter extends ArrayAdapter<MyImage> {
    private final int THUMBSIZE = 96;

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
    private long datetimeLong;
    private SimpleDateFormat df = new SimpleDateFormat("MMMM d, yy  h:mm");

    public MyImage(String title, String description, String path,
            long datetimeLong) {
        this.title = title;
        this.description = description;
        this.path = path;
        this.datetimeLong = datetimeLong;
    }

    public MyImage() {
    }

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
    public Calendar getDatetime() {
        Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(datetimeLong);
        return cal;
    }

    /**
     * Sets new datetimeLong.
     *
     * @param datetimeLong New value of datetimeLong.
     */
    public void setDatetime(long datetimeLong) {
        this.datetimeLong = datetimeLong;
    }

    /**
     * Sets new datetime.
     *
     * @param datetime New value of datetime.
     */
    public void setDatetime(Calendar datetime) {
        this.datetimeLong = datetime.getTimeInMillis();
    }

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
        return "Title:" + title + "   " + df.format(getDatetime().getTime()) +
                "\nDescription:" + description;
    }
}
{% endhighlight %}

# SQLiteOpenHelper
Extends SQLiteOpenHelper to build a helper class to manage database creation and version management.

{% highlight java %}
public class DBhelper extends SQLiteOpenHelper {
    public static final String DB_NAME = "sqliteimage.db";
    public static final int DB_VERSION = 1;

    public static final String COMMA_SEP = ",";
    public static final String TEXT_TYPE = " TEXT";
    public static final String NUMERIC_TYPE = " NUMERIC";

    public static final String TABLE_NAME = "image";

    public static final String COLUMN_PATH = "path";
    public static final String COLUMN_TITLE = "title";
    public static final String COLUMN_DATETIME = "datetime";
    public static final String COLUMN_DESCRIPTION = "description";
    public static final String PRIMARY_KEY = "PRIMARY KEY (" + COLUMN_TITLE + "," + COLUMN_DATETIME + ")";

    private static final String DELETE_TABLE = "DROP TABLE IF EXISTS " + TABLE_NAME;
    private static final String CREATE_TABLE = "CREATE TABLE " + TABLE_NAME + " (" +
            COLUMN_PATH + TEXT_TYPE + COMMA_SEP +
            COLUMN_TITLE + TEXT_TYPE + COMMA_SEP +
            COLUMN_DESCRIPTION + TEXT_TYPE + COMMA_SEP +
            COLUMN_DATETIME + NUMERIC_TYPE + COMMA_SEP +
            PRIMARY_KEY +
            " )";

    public DBhelper(Context context) {
        super(context, DB_NAME, null, DB_VERSION);
    }

    @Override public void onCreate(SQLiteDatabase db) {
        db.execSQL(CREATE_TABLE);
    }

    @Override public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL(DELETE_TABLE);
        onCreate(db);
    }
}
{% endhighlight %}

# Data Access Object
create a `DAOdb` to handle add, delete, get etc. query data operations with database.

{% highlight java %}
public class DAOdb {

    private SQLiteDatabase database;
    private DBhelper dbHelper;

    public DAOdb(Context context) {
        dbHelper = new DBhelper(context);
        database = dbHelper.getWritableDatabase();
    }

    /**
     * close any database object
     */
    public void close() {
        dbHelper.close();
    }

    /**
     * insert a text report item to the location database table
     *
     * @param image
     * @return the row ID of the newly inserted row, or -1 if an error occurred
     */
    public long addImage(MyImage image) {
        ContentValues cv = new ContentValues();
        cv.put(DBhelper.COLUMN_PATH, image.getPath());
        cv.put(DBhelper.COLUMN_TITLE, image.getTitle());
        cv.put(DBhelper.COLUMN_DESCRIPTION, image.getDescription());
        cv.put(DBhelper.COLUMN_DATETIME, System.currentTimeMillis());
        return database.insert(DBhelper.TABLE_NAME, null, cv);
    }

    /**
     * delete the given image from database
     *
     * @param image
     */
    public void deleteImage(MyImage image) {
        String whereClause =
                DBhelper.COLUMN_TITLE + "=? AND " + DBhelper.COLUMN_DATETIME +
                        "=?";
        String[] whereArgs = new String[]{image.getTitle(),
                String.valueOf(image.getDatetimeLong())};
        database.delete(DBhelper.TABLE_NAME, whereClause, whereArgs);
    }

    /**
     * @return all image as a List
     */
    public List<MyImage> getImages() {
        List<MyImage> MyImages = new ArrayList<>();
        Cursor cursor =
                database.query(DBhelper.TABLE_NAME, null, null, null, null,
                        null, DBhelper.COLUMN_DATETIME + " DESC");
        cursor.moveToFirst();
        while (!cursor.isAfterLast()) {
            MyImage MyImage = cursorToMyImage(cursor);
            MyImages.add(MyImage);
            cursor.moveToNext();
        }
        cursor.close();
        return MyImages;
    }

    /**
     * read the cursor row and convert the row to a MyImage object
     *
     * @param cursor
     * @return MyImage object
     */
    private MyImage cursorToMyImage(Cursor cursor) {
        MyImage image = new MyImage();
        image.setPath(
                cursor.getString(cursor.getColumnIndex(DBhelper.COLUMN_PATH)));
        image.setTitle(
                cursor.getString(cursor.getColumnIndex(DBhelper.COLUMN_TITLE)));
        image.setDatetime(cursor.getLong(
                cursor.getColumnIndex(DBhelper.COLUMN_DATETIME)));
        image.setDescription(cursor.getString(
                cursor.getColumnIndex(DBhelper.COLUMN_DESCRIPTION)));
        return image;
    }
}
{% endhighlight %}

# `MainActivity xml`

`layout/activity_main.xml` has a ListView, and a Button to active Alert Dialog window:

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

# `Display Image Layout`
- Use TableRow to position the two buttons in a row and each button fill half of its parent width.
- Description text is positioned on top of the screen, with transparent background.

Transparency colors:

Hex Opacity Values:

- 100% — FF
- 95%  — F2
- 90%  — E6
- 85%  — D9
- 80%  — CC
- 75%  — BF
- 70%  — B3
- 65%  — A6
- 60%  — 99
- 55%  — 8C
- 50%  — 80
- 45%  — 73
- 40%  — 66
- 35%  — 59
- 30%  — 4D
- 25%  — 40
- 20%  — 33
- 15%  — 26
- 10%  — 1A
- 5%   — 0D
- 0%   — 00


{% highlight xml %}
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
                xmlns:tools="http://schemas.android.com/tools"
                android:layout_width="match_parent"
                android:layout_height="match_parent"
                android:orientation="vertical"
                tools:context="com.junjunguo.sqliteimage.DisplayImage">

    <ImageView
        android:id="@+id/display_image_view"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerInParent="true"
        android:padding="5dp"/>

    <TextView
        android:id="@+id/text_view_description"
        android:layout_width="fill_parent"
        android:layout_height="wrap_content"
        android:layout_gravity="top"
        android:gravity="center"
        android:textColor="@color/white"
        android:background="#809575CD"/>

    <TableRow
        android:id="@+id/table_row"
        android:layout_height="wrap_content"
        android:layout_width="fill_parent"
        android:weightSum="2"
        android:layout_alignParentBottom="true">

        <Button
            android:onClick="btnDeleteOnClick"
            android:layout_weight="1"
            android:layout_height="50dp"
            android:background="@color/deepPurple4"
            android:textColor="@color/white"
            android:layout_marginRight="1dp"
            android:id="@+id/btnDelete"
            android:text="Delete"/>

        <Button
            android:onClick="btnBackOnClick"
            android:layout_weight="1"
            android:layout_height="50dp"
            android:background="@color/deepPurple4"
            android:textColor="@color/white"
            android:layout_marginLeft="1dp"
            android:id="@+id/btnBack"
            android:text="Back"/>
    </TableRow>
</RelativeLayout>
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
    <string name="app_name">SqliteImage</string>
    <string name="hello_world">Hello world!</string>
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

# `AndroidManifest.xml`

in `AndroidManifest.xml` file set storage permission, and camera feature, set camera required to false if it is not
mandatory to have a camera to run the application.

`<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>`

`<uses-feature android:name="android.hardware.camera" android:required="false"/>`

and for full screen in display image window add:

`android:theme="@android:style/Theme.NoTitleBar.Fullscreen"`

AndroidManifest.xml:

{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
          package="com.junjunguo.sqliteimage">

    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
    <uses-feature
        android:name="android.hardware.camera"
        android:required="false"/>
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/AppTheme">
        <activity
            android:name=".MainActivity"
            android:label="@string/app_name">
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
        <activity
            android:name=".DisplayImage"
            android:label="@string/title_activity_display_image"
            android:theme="@android:style/Theme.NoTitleBar.Fullscreen">
        </activity>
    </application>

</manifest>

{% endhighlight %}


# References:

- http://developer.android.com/training/basics/data-storage/databases.html
- http://developer.android.com/reference/android/widget/ArrayAdapter.html
- http://developer.android.com/training/improving-layouts/smooth-scrolling.html
- https://github.com/codepath/android_guides/wiki/Using-an-ArrayAdapter-with-ListView
- http://developer.android.com/training/camera/photobasics.html
- http://developer.android.com/reference/android/media/ThumbnailUtils.html
- http://developer.android.com/training/displaying-bitmaps/load-bitmap.html#load-bitmap
- http://developer.android.com/guide/topics/resources/more-resources.html#Color


Source code [on Github](https://github.com/junjunguo/android/tree/master/2015/SqliteImage)

