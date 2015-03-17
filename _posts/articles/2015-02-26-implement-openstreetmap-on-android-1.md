---
layout: post
title: How to implement a simple OpenStreetMap on Android 
excerpt: "Example code for implementing a simple OSM on Android."
categories: articles
tags: [Android, code, Java, Map, Mobile]
image:
  feature: 100920020.jpg
  credit: GuoJunjun
  creditlink: http://junjunguo.com
comments: true
share: true
---

OpenStreetMap (OSM) is a free editable Wikipedia like world map. More information at [Wikipekia OSM](https://en.wikipedia.org/wiki/OpenStreetMap)

OSM allows user to download maps for offline use, this is a big advantage over Google Map, 
which is internet based the map. With OSM a map can be per download to an application, 
and can be used without internet. 

### Implement a Simple Open Street Map

Create an Android project.

In `res/layout/activity_main.xml` add:
{% highlight xml %}
<org.osmdroid.views.MapView
    android:layout_width="fill_parent"
    android:layout_height="fill_parent"
    android:id="@+id/mapview">
</org.osmdroid.views.MapView>
{% endhighlight %}

In `AndroidManifest.xml` add flowing permissions:
{% highlight xml %}
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
{% endhighlight %}

To use OSM in android app, there are two jars need to be included, osmdroid-android-x.xx.jar and slf4j-android-1.5.8.jar. osmdroid is a set of tools for OpenStreetMap data; SLF4J is a simplified logging facade. 

1. [osmdroid](https://code.google.com/p/osmdroid/wiki/Downloads)
    
    > [osmdroid-android-4.2.jar](https://oss.sonatype.org/content/groups/public/org/osmdroid/osmdroid-android/4
    .2/osmdroid-android-4.2.jar)

2. [SLF4J Android](http://www.slf4j.org/android/)
    
    > [slf4j-android-1.5.8.jar](slf4j-android-1.5.8.jar)

Import jars to project library, and the simple OSM is implemented. 

#### Simple functions

Add some simple functions to the map:
{% highlight java %}
private MapView mapView;
private MapController mapController;

@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
    mapView = (MapView) this.findViewById(R.id.mapview);
    mapView.setBuiltInZoomControls(true);
    mapView.setMultiTouchControls(true);
    mapController =(MapController) this.mapView.getController();
    mapController.setZoom(3);
}
{% endhighlight %}

This will give touch controls: move location, zoom  (like a simple Google map). Here is a screenshot:

![simple osm](https://raw.githubusercontent.com/junjunguo/android/master/OpenStreetMap/simpleosm.png)

To implement a simple OSM, remember download jars to project library, give permissions in Android manifest file and set 
view in layout file, then you can add more functions in the map Activity.
 
 Source code: [on GitHub](https://github.com/junjunguo/android/tree/master/OpenStreetMap)