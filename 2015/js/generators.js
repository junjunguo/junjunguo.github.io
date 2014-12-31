/**
 * Created by GuoJunjun on 29.12.14. JunjunGuo.com
 *
 */

var qtextfil = './junjunguofiles/quotations.txt';

var quotesArray = [], n, index;
var reader = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');

function loadQfile(textFile) {
    reader.open('get', textFile, true);
    reader.onreadystatechange = displayContents;
    reader.send(null);
}


function displayContents() {
    if (reader.readyState == 4) {
        quotesArray = reader.responseText.split("\n");
        totalQuotes = quotesArray.length;
        generateQuotes();
    } else {
        quotesArray = "Wonder is the beginning of wisdom.    <br>Socrates";
        totalQuotes = quotesArray.length;
    }
}


function generateQuotes() {
    n = quotesArray.length;
    if (n == 0) {
        loadFile();
    }
    index = Math.floor(Math.random() * (n));
    var theQuotation = quotesArray[index].split("#");
    quotesArray.splice(index, 1);
    var thequote = document.getElementById("anewquote");
    thequote.innerHTML = "<p>" + theQuotation[1] + "</p><h5> - " + theQuotation[0] + "</h5>";
}
// random quotations finish

// joke generator start

var imglist = [
    '2b就2b呗，还结巴.jpg',
    'Fast Food.jpg',
    'Its not a bug, its a feature..jpg',
    'The difference between women and men.jpg',
    'Todays Funny Wearing.jpg',
    'Wake Up.jpg',
    'random number.png',
    '万恶的备胎.jpg',
    '万恶的输入法.jpg',
    '为了这个男人.jpg',
    '主人，你过来，我保证不咬你.jpg',
    '主人，我美么.jpg',
    '乐呵乐呵哈.jpg',
    '人生是什么，恩？让我想想.jpg',
    '代码猿的痛.jpg',
    '你个骗纸！！！姿势简直太标准.gif',
    '你是怎么怀孕的.jpg',
    '你肚吾肚饿啊，我煮碗面俾你食啦~.jpg',
    '你这是在自己玩么.gif',
    '健身后的效果.jpg',
    '凌云飞渡笑傲江湖.gif',
    '勤劳的小松鼠.jpg',
    '卖柚子的你别跑啊....jpg',
    '南昌专列上车走了.jpg',
    '卧槽，不带这么玩的！.jpg',
    '原来”高攀不起“是这么来的!.gif',
    '去日本最好的季节.jpg',
    '县级公路惊现飘移车神.gif',
    '同学！你男盆友掉了.jpg',
    '呵呵，交接班.jpg',
    '哥们，好身手啊.gif',
    '哥们，算，算。。。算你很.gif',
    '哪来的蒙面大叔！？？.jpg',
    '唉，你说我怎么就学不会西红柿炒鸡蛋呢？！.jpg',
    '啪啪啪....jpg',
    '嘿嘿，嘿喂够。电臀都起来.gif',
    '坑爹的上帝.gif',
    '大哥你东西掉了.jpg',
    '大师，给算算咋破啊.jpg',
    '大爷，您能低调点吗？.jpg',
    '女同事的双手，瞬间真相了.jpg',
    '妈，我心脏有点不舒服，先挂了.jpg',
    '孩子 昨天晚上你看到了什么.gif',
    '小鸡的未来.jpg',
    '屌丝的逆袭.gif',
    '屌丝福利，全世界美女都归你.jpg',
    '应变.jpg',
    '当学渣遇上考试时，往往是介样的。。。.jpg',
    '彪悍的人生不需要解释.gif',
    '很想知道人为什么不能从水里跳这么高.gif',
    '快递小哥你又在卖萌了.jpg',
    '想开了好，以后还长着呢.jpg',
    '想要看起来像个大人，于是我就帮了他。。.jpg',
    '我只想说：这样有加班费么？？.jpg',
    '我太帅了.jpg',
    '我是一个装满眼泪的瓶子.jpg',
    '我有特殊的撬别人女朋友的技巧.gif',
    '我来教你怎么走路.gif',
    '挤眉弄眼神马的最开心了.gif',
    '救人一命，胜造七级浮屠.jpg',
    '每个人都是宇宙的中心.GIF',
    '灰太狼失败的基本原因是别的狼都吃生的.jpg',
    '熊孩子，逗姥姥玩是吧！.gif',
    '牛.gif',
    '牛叉！！.gif',
    '疯子和傻子.jpg',
    '看到你的那一刻.jpg',
    '神回复.jpg',
    '第一遍看时并没有觉得哪里不对.jpg',
    '经济实惠的方式来解释男生女生之间的差异.jpg',
    '美女等一下.jpg',
    '老公还是你厉害.jpg',
    '老妈，你不用这么犀利吧？.jpg',
    '苦逼的程序员！.jpg',
    '萌哒哒滴！.jpg',
    '蛾眉大侠在此.jpg',
    '请尊重这门专业.jpg',
    '这技术，屌爆了！.gif',
    '这棵树真大.jpg',
    '这眼神，这表白，妹子跟我走吧.jpg',
    '这觉睡的真累！.jpg',
    '逗比女王，就是69.jpg',
    '都把山药功效吹得神乎其神.jpg',
    '防盗新技能.jpg',
    '难怪我那么喜欢蹭别人家的.jpg',
    '马拉个币的，只能走路回家了.gif' ]

var jtextFile = './image/fun/joke.txt';
var images = imglist;
var jokelist = [];

var readj = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
function loadJfile(textFile) {
    readj.open('get', textFile, true);
    readj.onreadystatechange = displayJContents;
    readj.send(null);
}

function displayJContents() {
    if (readj.readyState == 4) {
        jokelist = readj.responseText.split("#");
        jgenerator();
    } else {
        jokelist =
            '"Wife: "How would you describe me?"<br>Husband: "ABCDEFGHIJK."<br>Wife: "What does that mean?"<br>Husband: "Adorable, beautiful, cute, delightful, elegant, fashionable, gorgeous, and hot."<br>Wife: "Aw, thank you, but what about IJK?"<br>Husband: "I m just kidding!"';
    }
}

function jgenerator() {
    if (Math.floor((Math.random() * 10) % 2) == 0) { // 50% generate possibility
        if (images.length == 0) {
            images = imglist;
        }
        var index = Math.floor((Math.random() * (images.length)));
        var theImg = images.splice(index, 1);
        setJimage(theImg[0]);
    } else {
        settextjoke();
    }
}

function setJimage(theImg) {
    var str = theImg.split(".");
    var title = str[0];
    var fileType = str[1];
    document.getElementById("funny").innerHTML = "<img src='image/fun/" + theImg + "'" + "alt='junjunguo.com'>" + "\n" +
        "<h1>" + title + "</h1>";
}

var jokes = jokelist;
function settextjoke() {
    if (jokes.length == 0) {
        jokes = jokelist;
    }
    var index = Math.floor((Math.random() * (jokes.length)));

    if (jokes[index].length > 2) {
        document.getElementById("funny").innerHTML = "<p>" + text2html(jokes[index]) + "</p>";
    }
    jokes.splice(index, 1);
}

function text2html(str) {
    if (str.charAt(0) == "\n") {
        str = str.substr(1, str.length);
    }
    var find = '\n';
    var re = new RegExp(find, 'g');
    str = str.replace(re, '<br>');
    return str;
}


// load functions:   --------------------->

// load joke generator:
loadJfile(jtextFile);

var changeJoke = document.getElementById("topichumor");
changeJoke.onclick = function () {
    document.getElementById('myHumor').scrollIntoView()
    jgenerator();
}

//load random quotations:
loadQfile(qtextfil);

var changeQuotes = document.getElementById("anewquote");
changeQuotes.onclick = function () {
    document.getElementById('myQuotes').scrollIntoView()
    generateQuotes();
}

var changeQuoteC = document.getElementById("sectiontopic");
changeQuoteC.onclick = function () {
    document.getElementById('myQuotes').scrollIntoView()
    generateQuotes();
}