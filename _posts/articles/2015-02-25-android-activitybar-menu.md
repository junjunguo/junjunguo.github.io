---
layout: post
title: Android Menu
excerpt: "Example code for implementing Android action overflow menu"
categories: articles
tags: [Android, code, Java, Mobile, GUI]
image:
  feature: 14788493716_b68010de78_k.jpg
  credit: GuoJunjun
  creditlink: http://junjunguo.com
comments: true
share: true
---

Android Action Bar are used in many applications, it is easy to implement and for consistency in UI design it offers user a familiar interface across applications.

### Implement the overflow menu 

Create a new Android project.

In the main activity class, inflate the menu which will adds the items to the action bar. 

{% highlight java %}
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }
{% endhighlight %}

to handle the item select action rewrite the to do code in onOptionsItemSelected method:

{% highlight java %}
@Override
public boolean onOptionsItemSelected(MenuItem item) {
    switch (item.getItemId()) {
        case R.id.action_activity1:
            Toast.makeText(this, "item selected! move to Main activity", Toast.LENGTH_SHORT).show();
            startActivity(new Intent(this, MainActivity.class));
            return true;
        case R.id.action_activity2:
            Toast.makeText(this, "item selected! move to activity 2", Toast.LENGTH_SHORT).show();
            startActivity(new Intent(this, MainActivity2.class));
            return true;
        default:
            Toast.makeText(this, "item selected! default", Toast.LENGTH_SHORT).show();
            return super.onOptionsItemSelected(item);
    }
}
{% endhighlight %}

in the `res/menu/menu_main.xml` add the optional items for selection:

{% highlight xml %}
<item android:id="@+id/action_settings"
      android:title="@string/action_settings"
      android:orderInCategory="100"
      app:showAsAction="never"/>
<item android:id="@+id/action_activity1"
      android:title="Main Activity"
      android:orderInCategory="100"
      app:showAsAction="never"/>
<item android:id="@+id/action_activity2"
      android:title="Activity 2"
      android:orderInCategory="100"
      app:showAsAction="never"/>
{% endhighlight %}


Here is the simple overflow menu bar:

![oerfolw menu bar screenshot](https://raw.githubusercontent.com/junjunguo/android/39976ba2ddd44b7479c03f8d3070fc7268678cd9/AndroidMenubar/overflowmenu.png)

### Add buttons to Action bar

Sometime buttons or other actions are needed outside the overflow menu, it is easy to add buttons on the action bar when 
we already have the overflow menu.

add buttons in  `res/menu/menu_main.xml`:
{% highlight xml %}
...
<item android:id="@+id/status_button"
      android:title="actionBtn"
      android:orderInCategory="100"
      app:showAsAction="ifRoom"/>
<item android:id="@+id/action_button"
      android:title="actionBtn"
      android:orderInCategory="100"
      app:showAsAction="ifRoom"/>
{% endhighlight %}

to handle the button onClick action add code in onOptionsItemSelected method:

{% highlight java %}
@Override
public boolean onOptionsItemSelected(MenuItem item) {
    switch (item.getItemId()) {
        ...
        case R.id.status_button:
            Toast.makeText(this, "change button color", Toast.LENGTH_SHORT).show();
            return true;
        ...
    }
}
{% endhighlight %}

This is how it looks like:

![action bar button screenshot](https://raw.githubusercontent.com/junjunguo/android/master/AndroidMenubar/actionbarbutton.png)

To build menu in action bar, first selection items need to be ready in menu xml file, 
then add the items to action bar when Action created "onCreateOptionsMenu", and finally handle the actions at 
"onOptionsItemSelected".

Source code [on Github](https://github.com/junjunguo/android/tree/master/AndroidMenubar)