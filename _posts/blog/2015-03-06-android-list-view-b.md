---
layout: post
title: Android Implement a ListView
excerpt: "An Example of Implementing a ListView"
categories: blog
tags: [Android, code, Java, Mobile, GUI]
image:
  feature: summer2014-113.jpg
  credit: GuoJunjun
  creditlink: http://junjunguo.com
comments: true
share: true
---


A simple example of how to implement a list view in Android. You can extends a ListActivity instead of ActionBarActivity 
or Activity, but this example extends ActionBarActivity.

What's in the example?

* A list of strings: `mylist`
* An ArrayAdapter: `adapter` used to connect the data and view
* Item click listener: used to show an item, when it is clicked.

####the following image shows how it looks like.

![screenshot](https://raw.githubusercontent.com/junjunguo/android/master/AndroidListView/listview.png)


#####Steps:

In onCreate: 

* create a String list with some items in
* create an ArrayAdapter, add your list in, `android.R.layout.simple_list_item_1` is Android build in.
* setAdapter

Code:

{% highlight java %}
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_list_view);

    String[] mylist = new String[]{"CNY - Yuan Renminbi - China - Beijing", "USD - US Dollar - USA - Washington",
            "EUR - Euro - European-Union", "GBP - Pound Sterling - United-Kingdom - London",
            "INR - Indian Rupee - India - New Delhi", "AUD - Australian Dollar - Australia - Canberra",
            "CAD - Canadian Dollar - Canada - Ottawa", "SGD - Singapore Dollar - Singapore - Singapore",
            "CHF - Swiss Franc - Switzerland - Bern", "MYR - Malaysian Ringgit - Malaysia - Kuala Lumpur",
            "JPY - Japanese Yen - Japan - Tokyo", "NZD - New Zealand Dollar - New Zealand - Wellington",
            "HKD - Hong Kong Dollar - Hong Kong - Victoria", "SEK - Swedish Krona - Sweden - Stockholm",
            "NOK - Norwegian Krone - Norway - Oslo", "DKK - Danish Krone - Denmark - Copenhagen"};

    ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, mylist);

    ListView listView = (ListView) findViewById(R.id.my_listview);
    listView.setAdapter(adapter);
    addItemClickListener(listView);
}
{% endhighlight %}

`addItemClickListener(listView)` method is used to add listener and implement the react action.

{% highlight java %}
private void addItemClickListener(final ListView listView) {
    listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
        @Override public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
            String itemValue = (String) listView.getItemAtPosition(position);
            Toast.makeText(getApplicationContext(), "Position: " + position + " item: " + itemValue,
                    Toast.LENGTH_SHORT).show();
        }
    });
}
{% endhighlight %}

Add flowing code to layout activity :

{% highlight xml%}
<ListView
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:id="@+id/my_listview"></ListView>
{% endhighlight %}

Source code [on Github](https://github.com/junjunguo/android/tree/master/AndroidMenubar)