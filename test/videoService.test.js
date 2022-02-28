const videoService = require("../src/videoService");

test("Deve retornar uma lista de videos", function () {
	const videos = videoService.getVideos();
	expect(videos).toHaveLength(1);
});

test("Deve retornar uma lista de videos com filtro", function () {
	const videos = videoService.getVideosByTitle("Introduction to Node.js");
	expect(videos).toHaveLength(1);
});
