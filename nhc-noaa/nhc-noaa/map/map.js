﻿var Map = (function () {
    var interval;
    var count = 0;
    var paused = true;
    var images = [];
    var cdn = "http://az843447.vo.msecnd.net";

    function loading() {
        $("#loader").show();
        $("#controls input").prop("disabled", true);
    }

    function loaded() {
        $("#loader").fadeOut("slow");
        $("#controls input").prop("disabled", false);
    }

    function changeCount() {
        var strCount = $("#count").val();
        var intCount = 100;
        if ($.isNumeric(strCount)) {
            history.pushState(null, null, "#" + strCount);
            intCount = parseInt(strCount);
        } else {
            $("#count").val(intCount);
        }
        getImages(intCount);
    }

    function getImages(intCount) {
        loading();
        paused = true;
        $.ajax({
            type: "GET",
            url: cdn + "/api/Images/EastAtlantic?count=" + intCount,
            cache: false,
            success: successFunc,
            error: errorFunc
        });
    }

    function sprite(image) {
        var imgTag = "<img class='sprite' style='background:url(" + cdn + "/goes_east_tatl_img/" + image + ") 0 -465px'>";
        $("#data").append(imgTag);
    }

    function successFunc(data) {
        images = data;
        images.reverse();
        $("#data").empty();
        sprite(images[0]);
        sprite(images[images.length - 1]);
        addAllImages();
        count = 0;
    }

    function errorFunc(err) {
        if (err.responseText === "")
            alert("Sorry the communication failed.");
        else
            alert(err.responseText);
    }

    function changePos(pos) {
        count += pos;
        paused = true;
        showImage();
    }

    function showImage() {
        if (count < 0) count = images.length - 1;
        if (count >= images.length) count = 0;
        $("#map").attr("src", cdn + "/goes_east_tatl_img/" + images[count]);
        $(".active").removeClass("active");
        $("#img" + (count + 1000)).addClass("active");
    }

    function changeImage() {
        if ((!paused) && (images.length > 1)) {
            showImage();
            count += 1;
        }
    }

    function appendImage(i) {
        var imageTag = '<img id="img' + (i + 1000) + '" src="' +
                        cdn + '/goes_east_tatl_img/' + images[i] +
                        '" title="' + images[i] + '">';
        $("#images").append(imageTag);
        if ($("#images img").length === images.length) {
            loaded();
            paused = false;
        }
    }

    function getTitles(x, y) {
        return y.attributes.title.value;
    }

    function addAllImages() {
        var imgs = $("#images img").map(getTitles);
        $("#images").empty();
        for (var i = 0; i < images.length; i++) {
            var delay = i * 50;
            if ($.inArray(images[i], imgs) > 0) delay = i * 8;
            setTimeout(appendImage.bind(null, i), delay);
        }
    }

    function changeSpeed() {
        paused = false;
        clearInterval(interval);
        interval = setInterval(changeImage, $("#speed").val());
    }

    function init() {
        interval = setInterval(changeImage, 100);
        changeCount();
    }

    return {
        changeCount: changeCount,
        changeSpeed: changeSpeed,
        changePos: changePos,
        init: init
    };
})();


$(window).load(function () {
    var hash = window.location.hash.replace("#", "");
	if ($.isNumeric(hash)) $("#count").val(hash);
	$("#back").click(function () { Map.changePos(-1); });
	$("#forw").click(function () { Map.changePos(1); });
	$("#speed").click(Map.changeSpeed);
	$("#count").change(Map.changeCount);
    Map.init();
});