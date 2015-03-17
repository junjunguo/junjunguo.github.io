---
layout: post
title: Android use AsyncTask or Executor to repeat tasks in background
excerpt: "How to repeatedly do tasks with AsyncTask or Executor"
categories: articles
tags: [Android, code, GUI, XML Mobile]
image:
  feature: summer2014-118.jpg
  credit: GuoJunjun
  creditlink: http://junjunguo.com
comments: true
share: true
---

We often need to do some tasks in background periodically, this tutorial describes three methods to do tasks periodically. 

# Contents
{:.no_toc}

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# TableLayout
A Table Layout in Android is similar with Table in HTML, which you can define
 the whole table in TableLayout and define RowLayout for each row, and define
  the element in the row.

> To make the row fill up the parent, we set `stretchColumns="*"` so the row
elements will stretch to fill the parent.

> Use `layout_span=` to define how much column space each of the row element
will take. The code bellow: in first row each element take 1 portion; in
second there is only one element and it takes 3 portion, the whole row space.

Here is how is looks when it is done:

![TableLayout](https://raw.githubusercontent
.com/junjunguo/android/master/2015/MyTableView/tableview1.png)

![TableLayout](https://raw.githubusercontent
.com/junjunguo/android/master/2015/MyTableView/tableview2.png)

## Layout xml:

{% highlight xml %}
<TableLayout xmlns:android="http://schemas.android.com/apk/res/android"
             xmlns:tools="http://schemas.android.com/tools"
             android:layout_width="match_parent"
             android:layout_height="match_parent"
             android:paddingLeft="@dimen/activity_horizontal_margin"
             android:paddingRight="@dimen/activity_horizontal_margin"
             android:stretchColumns="*"
             android:paddingTop="@dimen/activity_vertical_margin"
             android:paddingBottom="@dimen/activity_vertical_margin"
             tools:context=".MainActivity">

    <!--row 1-->
    <TableRow
        android:layout_width="fill_parent"
        android:gravity="center_horizontal">

        <Button
            android:layout_span="1"
            android:background="@color/blue1"
            android:height="100dp"
            android:gravity="center"
            android:text="row 1 \n column 1"/>

        <Button
            android:layout_span="1"
            android:layout_width="match_parent"
            android:background="@color/blue2"
            android:height="100dp"
            android:gravity="center"
            android:text="row 1 \n column 2"/>

        <Button
            android:layout_span="1"
            android:layout_width="match_parent"
            android:background="@color/blue3"
            android:height="100dp"
            android:gravity="center"
            android:text="row 1 \n column 3"/>
    </TableRow>

    <!--row 2-->
    <TableRow
        android:gravity="center_horizontal"
        android:layout_width="fill_parent">

        <Button
            android:layout_span="3"
            android:background="@color/blue4"
            android:height="100dp"
            android:text="row 2 \n column 1"/>
    </TableRow>
    <!-- row 3-->
    <TableRow
        android:gravity="center_horizontal"
        android:layout_width="fill_parent">

        <Button
            android:layout_span="1"
            android:background="@color/blue5"
            android:height="100dp"
            android:text="row 3 \n column 1"/>

        <Button
            android:layout_span="2"
            android:height="100dp"
            android:background="@color/blue6"
            android:text="row 3 \n column 2"/>

    </TableRow>

    <!-- row 4-->
    <TableRow
        android:gravity="center_horizontal"
        android:layout_width="fill_parent">

        <Button
            android:layout_span="2"
            android:background="@color/blue4"
            android:height="100dp"
            android:text="row 4 \n column 1"/>

        <Button
            android:layout_span="1"
            android:height="100dp"
            android:background="@color/blue3"
            android:text="row 4 \n column 2"/>
    </TableRow>
</TableLayout>
{% endhighlight %}

# colors.xml
The blue style colors in `values/colors.xml`:

{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="blue1">#0D47A1</color>
    <color name="blue2">#1976D2</color>
    <color name="blue3">#2196F3</color>
    <color name="blue4">#64B5F6</color>
    <color name="blue5">#90CAF9</color>
    <color name="blue6">#E3F2FD</color>
</resources>
{% endhighlight %}

And we have our TableLayout implemented.

Source code [on Github](https://github.com/junjunguo/android/tree/master/2015/MyTableView)

