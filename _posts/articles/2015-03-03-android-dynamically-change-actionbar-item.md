---
layout: post
title: Android dynamically change actionbar item
excerpt: "Change text dynamically for android actionbar item text"
categories: articles
tags: [Android, code, Java, Mobile, GUI]
image:
  feature: summer2014-114.jpg
  credit: GuoJunjun
  creditlink: https://junjunguo.github.io
comments: true
share: true
---


Android Action Bar are used in many applications, it is easy to implement and for consistency in UI design it offers user a familiar interface across applications.

Previous post: [Implement the overflow menu](https://junjunguo.github.io/articles/android-activitybar-menu/)

This post give a simple example of how to dynamically change actionbar item text. 

The trick is simply use

> public boolean onPrepareOptionsMenu (Menu menu)

Which prepare the Screen's standard options menu to be displayed:

> This is called right before the menu is shown, every time it is shown. You can use this method to efficiently enable/disable items or otherwise dynamically modify the contents.

The example code will create a item, and the item title (when there is no icon, item text will be treated as title text) 
start with 0, every time it is clicked the number will go up.

* by doing so first we create a `point` variable
* and then set it to a item we want it to be by `find menu item'

here is how the code look like:

{% highlight java %}
private int points = 0;
@Override public boolean onPrepareOptionsMenu(Menu menu) {
    MenuItem score = menu.findItem(R.id.status_button);
    score.setTitle(String.valueOf(points));
    return super.onPrepareOptionsMenu(menu);
}
{% endhighlight %}

to handle the item that has been clicked in onOptionsItemSelected:

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
        case R.id.status_button:
            Toast.makeText(this, "status bar clicked!", Toast.LENGTH_SHORT).show();
            points++;
            invalidateOptionsMenu();
        default:
            Toast.makeText(this, "item selected! default", Toast.LENGTH_SHORT).show();
            return super.onOptionsItemSelected(item);
    }
}
{% endhighlight %}

Here are screenshots:

![dynamically change item title screenshot](https://raw.githubusercontent.com/junjunguo/android/master/AndroidMenubar/itemhandle0.png)
![dynamically change item title screenshot](https://raw.githubusercontent.com/junjunguo/android/master/AndroidMenubar/itemhandle12.png)


Source code [on Github](https://github.com/junjunguo/android/tree/master/AndroidMenubar)