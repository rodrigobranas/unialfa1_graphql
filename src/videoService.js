const videos = [
	{
		idVideo: "1",
		title: "Introduction to Node.js",
		length: 100
	}
];

exports.getVideos = function () {
	return videos;
}

exports.getVideosByTitle = function (title) {
	return videos.filter(video => video.title.includes(title));
}
