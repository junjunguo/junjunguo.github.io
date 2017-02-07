---
layout: post
title: Android Send Message to Other Activity
excerpt: "Send Message from one Activity to another"
categories: articles
tags: [Android, code, Java, Mobile]
image:
  feature: summer2014-119.jpg
  credit: GuoJunjun
  creditlink: https://junjunguo.github.io
comments: true
share: true
---

How to send a message, an object or any other data from one activity to another? When we use Intent to open another 
activity, 
we can actually pass our data by use `putExtra`, which can add data to Intent. And then use `getExtras` to retrieve the data 
send from other activity. The example code will show how to implement it.

> the example code is built with Android Studio; Minimum Sdk Version: 11; Target Sdk Version 21.

This trick should work on all sdk versions.

## How to implement sending data to another activity?
We create to Activities: 

`FirstActivity` 

* write a message and send it to `SecondActivity` 

`SecondActivity` 

* Show the message on screen


Here is how it looks like when it is done: 

![screenshot](https://raw.githubusercontent.com/junjunguo/android/master/2015/SendMessagetoOtherActivity/write.png)

![screenshot](https://raw.githubusercontent.com/junjunguo/android/master/2015/SendMessagetoOtherActivity/receive.png)

## Create `FirstActivity`

{% highlight java %}
private EditText message;
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_first);
    message = (EditText) findViewById(R.id.edit_text_write_message);
}
public void messageBTNOnClicked(View view) {
    Toast.makeText(getApplicationContext(), "your message: " + message.getText().toString() + " sent !",
            Toast.LENGTH_SHORT).show();

    Intent intent = new Intent(this, SecondActivity.class);
    intent.putExtra("MESSAGE", message.getText().toString());
    finish();
    startActivity(intent);
}
{% endhighlight %}

add following to FirstActivity layout:
{% highlight xml %}
<EditText
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:id="@+id/edit_text_write_message"
    android:hint="@string/write_message"
    android:layout_marginRight="5dp"
    android:layout_marginLeft="5dp"
    android:layout_marginTop="8dp"
    android:layout_marginBottom="15dp"
    android:inputType="textMultiLine"
    android:gravity="center"
    android:layout_centerHorizontal="true"/>

<Button
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:onClick="messageBTNOnClicked"
    android:width="200dp"
    android:layout_centerHorizontal="true"
    android:text="@string/send_button"
    android:layout_below="@id/edit_text_write_message"/>
{% endhighlight %}

## Create `SecondActivity`
{% highlight java %}
private TextView textView;

@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_second);

    textView = (TextView) findViewById(R.id.text_view);
    Bundle extras = getIntent().getExtras();

    if (extras != null) {
        textView.setText("message from first activity: " + extras.getString("MESSAGE"));
    }
}
public void viewBTNOnClicked(View view) {
    Toast.makeText(getApplicationContext(), "to second screen", Toast.LENGTH_SHORT).show();
    finish();
    startActivity(new Intent(this, FirstActivity.class));
}
{% endhighlight %}

add following to SecondActivity layout:
{% highlight xml %}
<TextView
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:id="@+id/text_view"
    android:gravity="center"
    android:layout_marginRight="5dp"
    android:layout_marginLeft="5dp"
    android:layout_marginTop="8dp"
    android:layout_marginBottom="15dp"
    android:layout_centerHorizontal="true"/>

<Button
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:onClick="viewBTNOnClicked"
    android:width="200dp"
    android:layout_centerHorizontal="true"
    android:text="@string/next_screen"
    android:layout_below="@id/text_view"/>
{% endhighlight %}

And we have our project implemented.

Source code [on Github](https://github.com/junjunguo/android/tree/master/2015/SendMessagetoOtherActivity)