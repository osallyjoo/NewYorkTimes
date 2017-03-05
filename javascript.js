// click event for when user clicks search button
$("#searchButton").on("click",function(){
	event.preventDefault();
	var searchTerm = $("#searchTerm").val().trim();
	var numRecords = $("#numRecords").val();

	// if no start or end year is entered, use beginning of time until now
	if ($("#startYear").val().trim().length === 0){
		startYear = "00000000";
	} else {
		startYear = $("#startYear").val();
	}
	if ($("#endYear").val().trim().length === 0){
		endYear = "20170228";
	} else {
		endYear = $("#endYear").val();
	}

	searchArticles(searchTerm, numRecords, startYear, endYear);
});

$("#clearButton").on("click",function(){
	$("#topArticles").html("");
	$("#searchTerm").val("");
	$("#startYear").val("");
	$("#endYear").val("");
});

// searchArticles function takes in four parameters
function searchArticles(searchTerm, numRecords, startYear, endYear){
	queryObject = {
		q: searchTerm,
		begin_date: startYear,
		end_year: endYear,
	};
	queryObject = $.param(queryObject);
	queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=b9f91d369ff59547cd47b931d8cbc56b:0:74623931&q="+queryObject;

	$.ajax({
		url: queryURL,
		method: "GET"
	}).done(function(response){
		//data retrieved gets stored in variable data
		var data = response.response.docs;
		console.log(data);

		// Loop to get the selected number of articles
		for(var i=0; i < numRecords; i++) {
			console.log("Record " + i);
			console.log(data[i].headline.main);

			// create div container for article
			var articleDiv = $("<div>");
			var artTitle = $("<h2 class='articleTitle'>").text(data[i].headline.main);
			var snippet = $("<p class='articleSnippet'>").text(data[i].snippet);
			var author = $("<h4 class='articleAuthor'>");
			var section = $("<p class='articleSection'>");
			var date = $("<p class='articleDate'>");
			var url = $("<a class='articleURL' target='_blank'>").attr("href",data[i].web_url).html("Read article <span class='glyphicon glyphicon-chevron-right'></span>");

			// trim pub date to display only yyy-mm-dd
			var dateTrimmed = data[i].pub_date.substr(0, 10);

			// retrieve and display byline, section, date
			(data[i].byline) ? author.text("Author: " + data[i].byline.original) : author.text("Author: Not found");
			(data[i].section_name) ? section.text("Section: " + data[i].section_name) : section.text("Section: Not found");
			(data[i].pub_date) ? date.text("Date: " + dateTrimmed) : date.text("Date: Not found");

			// append article data to div container and display on html
			articleDiv
				.append(artTitle)
				.append(snippet)
				.append(author)
				.append(section)
				.append(date)
				.append(url);
			$("#topArticles").append(articleDiv);
		}
		});
};

