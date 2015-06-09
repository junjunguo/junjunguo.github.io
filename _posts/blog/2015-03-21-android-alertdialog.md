---
layout: post
title: Android Alert Dialog
excerpt: "Android display dialog box / popup window"
categories: articles
tags: [Android, code, GUI, Java, Mobile]
image:
  feature: summer2014-117.jpg
  credit: GuoJunjun
  creditlink: http://junjunguo.com
comments: true
share: true
---

# Contents
{:.no_toc}

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# Alert Dialog box
An Alert Dialog box or popup window is useful when it is needed to ask the user to make a decision, like a yes or no,
 or response to some particular action etc, in the same screen.

> A dialog is a small window that prompts the user to make a decision or enter additional information. A dialog does not fill the screen and is normally used for modal events that require users to take an action before they can proceed.

> Dialogs prompt the user for decisions or additional information required by the app to continue a task. Such requests can range from simple Cancel/OK decisions to more complex layouts asking the user to adjust settings or enter text.

Implementation:

- Use Dialog to build a Dialog box (popup window)
- One xml to define main window
- another xml to define custom Dialog box layout

Here is how it looks when it is done:

![TableLayout](https://raw.githubusercontent.com/junjunguo/android/master/2015/AlertDialog/window.png)

![TableLayout](https://raw.githubusercontent.com/junjunguo/android/master/2015/AlertDialog/dialog.png)

# Main Activity class

{% highlight java %}
package com.junjunguo.alertdialogbuilder;

import android.app.Dialog;
import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class MainActivity extends ActionBarActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    public void btnAlertDialogClicked(View v) {
        final Dialog dialog = new Dialog(this);
        dialog.setContentView(R.layout.custom_layout);
        dialog.setTitle("Alert Dialog View");

        TextView textView = (TextView) dialog.findViewById(R.id.custom_text_view);
        textView.setText("Alert Dialog view : imageView+textView+Button");

        Button btnExit = (Button) dialog.findViewById(R.id.btnExit);
        btnExit.setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                dialog.dismiss();
            }
        });
        // show dialog on screen
        dialog.show();
    }
}
{% endhighlight %}

# `layout/MainActivity`

`layout/MainActivity` has a TextView and a Button to active Alert Dialog window:

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
        android:text="@string/alert_dialog"
        android:id="@+id/custom_text_view"
        android:textSize="24dp"
        android:layout_marginBottom="30dp"
        android:textColor="@color/red1"
        android:layout_width="wrap_content"
        android:layout_centerInParent="true"
        android:layout_height="wrap_content"/>

    <Button
        android:onClick="btnAlertDialogClicked"
        android:id="@+id/btnShowAlert"
        android:background="@color/red2"
        android:textColor="@color/white"
        android:layout_centerHorizontal="true"
        android:padding="20dp"
        android:layout_below="@id/custom_text_view"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/show_alert_view"/>
</RelativeLayout>
{% endhighlight %}

# `layout/custom_layout.xml`

`layout/custom_layout.xml` defines the outlook of Alert Dialog window, which contains:

- An ImageView shows an image
- a TextView to display text
- and an exit button

{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
                android:layout_width="fill_parent"
                android:background="@color/red5"
                android:paddingLeft="@dimen/activity_horizontal_margin"
                android:paddingRight="@dimen/activity_horizontal_margin"
                android:paddingTop="@dimen/activity_vertical_margin"
                android:paddingBottom="@dimen/activity_vertical_margin"
                android:layout_height="fill_parent">

    <ImageView
        android:id="@+id/img_icon"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:src="@drawable/ic_launcher"
        android:layout_centerHorizontal="true"
        android:padding="5dp"/>

    <TextView
        android:text="@string/alert_dialog"
        android:id="@+id/custom_text_view"
        android:textSize="20dp"
        android:layout_below="@id/img_icon"
        android:layout_centerHorizontal="true"
        android:layout_marginBottom="20dp"
        android:layout_marginTop="20dp"
        android:textColor="@color/red1"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"/>

    <Button
        android:onClick="btnExitClicked"
        android:id="@+id/btnExit"
        android:background="@color/red1"
        android:textColor="@color/red5"
        android:layout_centerHorizontal="true"
        android:layout_below="@id/custom_text_view"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/exit"/>
</RelativeLayout>
{% endhighlight %}

# strings.xml
The `strings.xml` in `values`

{% highlight xml %}
<resources>
    <string name="app_name">AlertDialog Builder</string>
    <string name="hello_world">Hello world!</string>
    <string name="action_settings">Settings</string>
    <string name="alert_dialog">Alert Dialog</string>
    <string name="show_alert_view">Show Alert View</string>
    <string name="exit">Exit</string>
</resources>
{% endhighlight %}

# colors.xml
The blue style colors in `values/colors.xml`:

{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="red1">#D50000</color>
    <color name="red2">#FF1744</color>
    <color name="red3">#FF5252</color>
    <color name="red4">#FF8A80</color>
    <color name="red5">#FFCDD2</color>
    <color name="black">#000</color>
    <color name="white">#fff</color>
</resources>
{% endhighlight %}


Source code [on Github](https://github.com/junjunguo/android/tree/master/2015/AlertDialog)

