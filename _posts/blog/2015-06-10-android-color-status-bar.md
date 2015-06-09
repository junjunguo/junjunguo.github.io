---
layout: post
title: Android Color status bar
excerpt: "How to change status bar color to match app for API 19+"
categories: blog
tags: [Android, code, GUI, XML, Mobile]
image:
  feature: summer2014-118.jpg
  credit: GuoJunjun
  creditlink: http://junjunguo.com
comments: true
share: true
---

# Contents
{:.no_toc}

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# Customize the Status Bar
The material theme lets developers easily customize the status bar, developers can specify a color that fits their brand and provides enough contrast to show the white status icons. 
![TableLayout](https://raw.githubusercontent.com/junjunguo/android/master/2015/SystemBarColor/ThemeColors.png)

Problem is that the material theme is only available in Android 5.0 (API level 21) and above, which currently have too few people use it in their Android device, I don’t have it in my Android. But I do have Android 4.4 (API level 19). Luckily we can change status bar color from API 19 and above.

There are many ways to achieve it, and I’m going to post two ways to do the job.

First, the easiest way which use [Android System Bar Tint - made by Jeff Gilfelt](https://github.com/jgilfelt/SystemBarTint), this is good for fullscreen activities.


#How it looks

Here is how is looks when it is done:

![system bar color](https://raw.githubusercontent.com/junjunguo/android/master/2015/SystemBarColor/actionbarcolorl.png)

![system bar color](https://raw.githubusercontent.com/junjunguo/android/master/2015/SystemBarColor/actionbarcolorp.png)

#Implementation:

add `compile 'com.readystatesoftware.systembartint:systembartint:1.0.3'` to your dependencies in `build.gradle`. 

 

and in your Activity:

{% highlight java %}
public class MainActivity extends Activity {
    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            setTranslucentStatus(true);
        }
        SystemBarTintManager tintManager = new SystemBarTintManager(this);
        tintManager.setStatusBarTintEnabled(true);
        tintManager.setNavigationBarTintEnabled(true);
        tintManager.setStatusBarTintResource(R.color.statusbar_bg);
        tintManager.setNavigationBarTintColor(Color.parseColor("#99ffffff"));
    }
    @TargetApi(19) private void setTranslucentStatus(boolean on) {
        Window win = getWindow();
        WindowManager.LayoutParams winParams = win.getAttributes();
        final int bits = WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS;
        if (on) {
            winParams.flags |= bits;
        } else {
            winParams.flags &= ~bits;
        }
        win.setAttributes(winParams);
    }
}
{% endhighlight %}

You will need to make `values/styles.xml`, `values-v14/styles.xml`, `values-v19/styles.xml` for different API levels.

[Example code](https://github.com/junjunguo/android/tree/master/2015/SystemBarColor)