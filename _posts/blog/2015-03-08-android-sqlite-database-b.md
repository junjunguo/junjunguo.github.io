---
layout: post
title: Android Saving Data in SQLite Database
excerpt: "How to implement SQLite for Android applications"
categories: blog
tags: [SQLite, Database, Android, code, Java, Mobile, GUI]
image:
  feature: summer2014-115.jpg
  credit: GuoJunjun
  creditlink: https://junjunguo.github.io
comments: true
share: true
---

This tutorial describes how to use SQLite database in Android applications. The example code creates a [ListView](https://junjunguo.github.io/articles/android-list_view/) in the main Activity to show the data entries, and also creates another window activity for write new data entries. 

# Contents
{:.no_toc}

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# SQLite and Android database

## Saving Data in Databases
When the application will generate a large amount of data, especially when the data is structured or repeated, use a database is ideal to organize and handle the generated data.

## SQLite
SQLite is an Open Source database, [SQLite](http://www.sqlite.org/) is a most widely deployed SQL database engine in the world. It is small in size and requires a small size of memory to run. 

## SQLite in Android
Android organize all applications in blocks(each application is putted in a box, applications are not supposed to communicate or access to other boxes, unless we setted it to do so), which means applications do not have access to each other by default. Any databases being created will be accessible by name to any class in the application, but not outside the application. Android provides full support for SQLite databases (include all sdk versions). So we have no reason to not use SQLite.
 
# Saving Data in SQLite Database

## About the project
The following demonstration will show how to implement SQLite for Android applications by some example code. 

* We will first extends SQLiteOpenHelper, which will help us to managing database creation.
* And use a Data Access Object (DAO) to manage querying for us.
* We will also create a class for holding all our table names and column names, which will make us easier to organize, maintain tables and columns, specially when we have a lot of tables.
* We will create a data type class to hold data entry as an object.
* write text will be setted to its own window.
* In the end we will implement a ListView to show all data entries. 

> the example code is built with Android Studio; Minimum Sdk Version: 11; Target Sdk Version 21.

Here is how the project looks like when it is done: 

![screenshot](https://raw.githubusercontent.com/junjunguo/android/master/SQLiteDB/send.png)
![screenshot](https://raw.githubusercontent.com/junjunguo/android/master/SQLiteDB/view.png)

## Create a class to hold our table names
create a class for holding all our table names and column names, which will make us easier to organize, 
maintain tables and columns, specially when we have a lot of tables. We organize each table as a inner class.

{% highlight java %}
public class DBtables {
    // To prevent someone from accidentally instantiating the contract class, give it an empty constructor.
    public DBtables() {}

    /* Inner class that defines the table contents */
    public static abstract class TextReport implements BaseColumns {
        public static final String TABLE_NAME = "textreport";
        public static final String COLUMN_NUSER_ID = "userid";
        public static final String COLUMN_REPORT = "report";
        public static final String COLUMN_ISREPOETED = "isreported";
        public static final String COLUMN_DATETIME = "datetime";
        public static final String COLUMN_LATITUDE = "latitude";
        public static final String COLUMN_LONGITUDE = "longtitude";
        public static final String PRIMARY_KEY = "PRIMARY KEY (" + COLUMN_NUSER_ID + "," + COLUMN_REPORT +
                "," + COLUMN_LONGITUDE + "," + COLUMN_LATITUDE + ")";
        public static final String[] ALL_COLUMNS =
                {COLUMN_NUSER_ID, COLUMN_REPORT, COLUMN_ISREPOETED, COLUMN_DATETIME, COLUMN_LATITUDE, COLUMN_LONGITUDE};
    }
}
{% endhighlight %}

## Use SQLiteOpenHelper
Use SQLiteOpenHelper to help us create database:

{% highlight java %}
public class DBhelper extends SQLiteOpenHelper {
    public static final String DB_NAME = "mydatabase.db";
    public static final int DB_VERSION = 1;

    private static final String TEXT_TYPE = " TEXT";
    private static final String REAL_TYPE = " REAL";
    private static final String NUMERIC_TYPE = " NUMERIC";
    private static final String COMMA_SEP = ",";

    private static final String CREATE_TEXTREPORT_TABLE = "CREATE TABLE " + DBtables.TextReport.TABLE_NAME + " (" +
            DBtables.TextReport.COLUMN_NUSER_ID + TEXT_TYPE + COMMA_SEP +
            DBtables.TextReport.COLUMN_REPORT + TEXT_TYPE + COMMA_SEP +
            DBtables.TextReport.COLUMN_DATETIME + NUMERIC_TYPE + COMMA_SEP +
            DBtables.TextReport.COLUMN_ISREPOETED + NUMERIC_TYPE + COMMA_SEP +
            DBtables.TextReport.COLUMN_LONGITUDE + REAL_TYPE + COMMA_SEP +
            DBtables.TextReport.COLUMN_LATITUDE + REAL_TYPE + COMMA_SEP +
            DBtables.TextReport.PRIMARY_KEY +
            " )";

    private static final String DELETE_TEXTREPORT_TABLE = "DROP TABLE IF EXISTS " + DBtables.TextReport.TABLE_NAME;

    public DBhelper(Context context) {
        super(context, DB_NAME, null, DB_VERSION);
    }

    public void onCreate(SQLiteDatabase db) {
        db.execSQL(CREATE_TEXTREPORT_TABLE);
    }

    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL(CREATE_TEXTREPORT_TABLE);
        onCreate(db);
    }
}
{% endhighlight %}

## Create Data Access Object

We implement a Data Access Object (DAO) to manage the query.

{% highlight java %}
public class DAOtextReport {
    private SQLiteDatabase database;
    private DBhelper dbHelper;

    public DAOtextReport(Context context) {
        dbHelper = new DBhelper(context);
        // Gets the data repository in write mode
        database = dbHelper.getWritableDatabase();
    }

    /**
     * close any database object
     */
    public void close() {
        dbHelper.close();
    }

    /**
     * insert a text report item to the textreport database table
     *
     * @param textReport
     * @return the row ID of the newly inserted row, or -1 if an error occurred
     */
    public long addReport(TextReport textReport) {
        // Create a new map of values, where column names are the keys
        ContentValues cv = new ContentValues();
        cv.put(DBtables.TextReport.COLUMN_NUSER_ID, textReport.getUserid());
        cv.put(DBtables.TextReport.COLUMN_REPORT, textReport.getReport());
        cv.put(DBtables.TextReport.COLUMN_ISREPOETED, textReport.isIsreported());
        cv.put(DBtables.TextReport.COLUMN_LONGITUDE, textReport.getLongitude());
        cv.put(DBtables.TextReport.COLUMN_LATITUDE, textReport.getLatitude());
        cv.put(DBtables.TextReport.COLUMN_DATETIME, System.currentTimeMillis());

        // Insert the new row, returning the primary key value of the new row
        return database.insert(DBtables.TextReport.TABLE_NAME, null, cv);
    }

    /**
     * update given text reports isReported value
     *
     * @param textReport
     * @return the number of rows affected
     */
    public long updateIsReported(TextReport textReport) {
        ContentValues cv = new ContentValues();
        cv.put(DBtables.TextReport.COLUMN_ISREPOETED, textReport.isIsreported());

        String where = DBtables.TextReport.COLUMN_NUSER_ID + "=" + textReport.getUserid() + "AND" +
                DBtables.TextReport.COLUMN_REPORT + "=" + textReport.getReport() + "AND" +
                DBtables.TextReport.COLUMN_DATETIME + "=" +
                textReport.getDatetime().getTimeInMillis();
        return database.update(DBtables.TextReport.TABLE_NAME, cv, where, null);
    }

    /**
     * @return all text reports as a List
     */
    public List<TextReport> getAllTextReports() {
        List<TextReport> textReports = new ArrayList<>();

        Cursor cursor =
                database.query(DBtables.TextReport.TABLE_NAME, DBtables.TextReport.ALL_COLUMNS, null, null, null, null,
                        DBtables.TextReport.COLUMN_DATETIME + " DESC");

        cursor.moveToFirst();
        while (!cursor.isAfterLast()) {
            TextReport textReport = cursorToTextReport(cursor);
            textReports.add(textReport);
            cursor.moveToNext();
        }
        // make sure to close the cursor
        cursor.close();
        return textReports;
    }


    /**
     * @return total row count of the table
     */
    public int getRowCount() {
        String countQuery = "SELECT  * FROM " + DBtables.TextReport.TABLE_NAME;
        Cursor cursor = database.rawQuery(countQuery, null);
        int count = cursor.getCount();
        cursor.close();
        return count;
    }

    /**
     * *
     *
     * @param cursor the cursor row
     * @return a TextReport
     */
    private TextReport cursorToTextReport(Cursor cursor) {
        TextReport tr = new TextReport();

        tr.setUserid(cursor.getString(cursor.getColumnIndex(DBtables.TextReport.COLUMN_NUSER_ID)));
        tr.setReport(cursor.getString(cursor.getColumnIndex(DBtables.TextReport.COLUMN_REPORT)));
        tr.setDatetime(cursor.getLong(cursor.getColumnIndex(DBtables.TextReport.COLUMN_DATETIME)));
        tr.setLongitude(cursor.getDouble(cursor.getColumnIndex(DBtables.TextReport.COLUMN_LONGITUDE)));
        tr.setLatitude(cursor.getDouble(cursor.getColumnIndex(DBtables.TextReport.COLUMN_LATITUDE)));
        // here we convert int to boolean
        tr.setIsreported(cursor.getInt(cursor.getColumnIndex(DBtables.TextReport.COLUMN_ISREPOETED)) > 0);
        return tr;
    }
}
{% endhighlight %}

* SQLite have very few data types, like it does not have boolean type, we use `cursor.getInt(cursor.getColumnIndex(DBtables.TextReport.COLUMN_ISREPOETED)) > 0` to set 
value back to boolean.

* We need a Calendar data type but SQLite do not support any Date, 
* one option is use data format to convert our Datetime to String and save it to SQLite, 
when we retrieve it we convert the string to Date Time or Calendar data type again.
* The other option is use a number instead of string, we use `System.currentTimeMillis()` to return a long data type, and save it on database, when we retrieve the date we convert it to Date Time or Calendar data type.
 
* Both options are easy to implement, and both works well. But here we choose to save it as a number, 
as it is easy to compare when it is a number, numbers are easy to handle, and in our example it needs few less steps than use a string. 


## Create a TextReport class
This class is the model and it contains all the data we need to save, retrieve from database and show them in our ListView.

{% highlight java %}
public class TextReport {
    private String userid, report;
    private boolean isreported;
    private Calendar datetime;
    private double latitude, longitude;

    /**
     * current data time will be generated when insert to database; isreported by default is set to false
     *
     * @param userid
     * @param report
     * @param latitude
     * @param longitude
     */
    public TextReport(String userid, String report, double latitude, double longitude) {
        this.longitude = longitude;
        this.latitude = latitude;
        this.userid = userid;
        this.report = report;
        this.isreported = false;
    }

    public TextReport() {
    }

    /**
     * Sets new report.
     *
     * @param report New value of report.
     */
    public void setReport(String report) { this.report = report; }

    /**
     * Sets new datetime.
     *
     * @param datetime New value of datetime.
     */
    public void setDatetime(Calendar datetime) { this.datetime = datetime; }


    /**
     * Sets new datetime.
     *
     * @param datetime New value of datetime.
     */
    public void setDatetime(long datetime) {
        Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(datetime);

        this.datetime = cal;
    }

    /**
     * Gets userid.
     *
     * @return Value of userid.
     */
    public String getUserid() { return userid; }

    /**
     * Gets latitude.
     *
     * @return Value of latitude.
     */
    public double getLatitude() { return latitude; }

    /**
     * Gets isreported.
     *
     * @return Value of isreported.
     */
    public boolean isIsreported() { return isreported; }

    /**
     * Sets new userid.
     *
     * @param userid New value of userid.
     */
    public void setUserid(String userid) { this.userid = userid; }

    /**
     * Gets report.
     *
     * @return Value of report.
     */
    public String getReport() { return report; }

    /**
     * Gets datetime.
     *
     * @return Value of datetime.
     */
    public Calendar getDatetime() { return datetime; }

    /**
     * Sets new longitude.
     *
     * @param longitude New value of longitude.
     */
    public void setLongitude(double longitude) { this.longitude = longitude; }

    /**
     * Gets longitude.
     *
     * @return Value of longitude.
     */
    public double getLongitude() { return longitude; }

    /**
     * Sets new latitude.
     *
     * @param latitude New value of latitude.
     */
    public void setLatitude(double latitude) { this.latitude = latitude; }

    /**
     * Sets new isreported.
     *
     * @param isreported New value of isreported.
     */
    public void setIsreported(boolean isreported) { this.isreported = isreported; }

    @Override public String toString() {
        return "userid='" + userid +
                ",      isreported=" + isreported +
                "\nreport='" + report +
                "\ndatetime=" + df.format(datetime.getTime()) +
                "\nlatitude=" + latitude +
                ", longitude=" + longitude;
    }

    public SimpleDateFormat df = new SimpleDateFormat("EEEE, MMMM d, yyyy 'at' h:mm a");
}
{% endhighlight %}


## Implement ListView to show data entries
This class implements a ListView, and show all data entries from database in ListView. A Toast to show clicked item, and a popup actionbar menu to choose write message window is also implemented.

{% highlight java %}
public class MainActivity extends ActionBarActivity {
    private DAOtextReport daOtextReport;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    @Override protected void onResume() {
        super.onResume();

        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, getList());
        ListView listView = (ListView) findViewById(R.id.my_listview);
        listView.setAdapter(adapter);
        addItemClickListener(listView);
    }

    /**
     * get all data entries from database as a string list
     *
     * @return String [] list
     */
    public String[] getList() {
        daOtextReport = new DAOtextReport(getApplicationContext());
        List<TextReport> alist = daOtextReport.getAllTextReports();
        String[] list = new String[alist.size()];
        for (int i = 0; i < alist.size(); i++) {
            list[i] = alist.get(i).toString();
        }
        daOtextReport.close();
        return list;
    }

    /**
     * Toast the clicked item
     *
     * @param listView
     */
    private void addItemClickListener(final ListView listView) {
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                String itemValue = (String) listView.getItemAtPosition(position);
                Toast.makeText(getApplicationContext(), "Position: " + position + " item: " + itemValue,
                        Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        switch (item.getItemId()) {
            case R.id.menu_write:
                startActivity(new Intent(this, ReportActivity.class));
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }
}
{% endhighlight %}

And here is layout for main activity:

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

    <ListView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:id="@+id/my_listview"></ListView>

</RelativeLayout>
{% endhighlight %}

## Implement write text window
A simple EditText is used to write text, and a send button to save text to database.

{% highlight java %}
public class ReportActivity extends ActionBarActivity {
    private EditText textReport;
    private DAOtextReport daOtextReport;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_report);

        textReport = (EditText) findViewById(R.id.report_edit_text);
        daOtextReport = new DAOtextReport(this);
    }

    /**
     * user click send report button
     *
     * @param view
     */
    public void textReportOnClicked(View view) {
        String report = textReport.getText().toString();
        long result = daOtextReport.addReport(new TextReport("junjunguo.com", report, 63.4187362, 10.4387621));

        if (result >= 0) {
            Toast.makeText(getApplicationContext(), "succsefully add report to row " + result, Toast.LENGTH_SHORT)
                    .show();
            textReport.getText().clear();
        } else {
            Toast.makeText(getApplicationContext(), "not succeed ! please try again !", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_report, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        switch (item.getItemId()) {
            case R.id.menu_view:
                daOtextReport.close();
                startActivity(new Intent(this, MainActivity.class));
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }
}
{% endhighlight %}

And layout for `ReportActivity` insert following:

{% highlight xml %}
<EditText
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:id="@+id/report_edit_text"
    android:hint="@string/write_your_text"
    android:layout_marginRight="5dp"
    android:layout_marginLeft="5dp"
    android:layout_marginTop="8dp"
    android:layout_marginBottom="15dp"
    android:inputType="textMultiLine"
    android:layout_centerHorizontal="true"/>

<Button
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:onClick="textReportOnClicked"
    android:width="200dp"
    android:layout_centerHorizontal="true"
    android:text="@string/send"
    android:layout_below="@id/report_edit_text"/>
{% endhighlight %}


## ActionBar menu 

Add a menu item to the ListView activity menu so we can switch to write window
{% highlight xml %}
<item
    android:id="@+id/menu_write"
    android:title="@string/write_report"
    android:orderInCategory="100"
    app:showAsAction="never"/>
{% endhighlight %}

and add menu item to write activity menu so we can switch back
{% highlight xml %}
<item
    android:id="@+id/menu_view"
    android:title="@string/view_report"
    android:orderInCategory="100"
    app:showAsAction="never"/>
{% endhighlight %}

And we have our project implemented.

Source code [on Github](https://github.com/junjunguo/android/tree/master/SQLiteDB)