/**
 * Plugin: protege
 * 
 * Version: 1.0
 * (c) Copyright 2010-2011, Gazow
 * 
 * Description: javascript plugin for display of social network photo albums
 *	IMPORTANT- path network and id variables must be declared for each instance of an album

 **/
 
 var customVars = [
	{		
		id		: 'albumList',
		network : "picasa" ,
		path 	: "https://picasaweb.google.com/data/feed/base/user/GazowSilvaggi/albumid/5633841495246757345?alt=rss&kind=photo&authkey=Gv1sRgCPP4jP2n3fv5UQ&hl=en_US",							
		display : "list" 			
	},
	{
		id		: 'expressivefuturism',
		network : "facebook" ,
		path 	: "360808727296850",							
		rows 	: 1 ,	collumns : 5 	
	},
	{
		id		: 'paintmarkers',
		network : "picasa" ,
		path 	: "https://picasaweb.google.com/data/feed/base/user/115479529124642182278/albumid/5717418287928760897?alt=rss&kind=photo&hl=en_US",							
		rows 	: 1 ,	collumns : 5 	
	},
	{
		id		: 'abstractexpression',
		network : "picasa" ,
		path 	:"https://picasaweb.google.com/data/feed/base/user/GazowSilvaggi/albumid/5674269535817947665?alt=rss&kind=photo&hl=en_US",							
		rows 	: 1 ,	collumns : 5 		
	},
	{
		id		: 'acrylic',
		network : "picasa" ,
		path 	: "https://picasaweb.google.com/data/feed/base/user/GazowSilvaggi/albumid/5636146367608162881?alt=rss&kind=photo&hl=en_US",							
		rows 	: 1 ,	collumns : 6 		
	},
	{
 		id		: 'alcoholink',
		network : "picasa" ,
		path	: "https://picasaweb.google.com/data/feed/base/user/GazowSilvaggi/albumid/5634267631147620625?alt=rss&kind=photo&hl=en_US",							
		rows 	: 1 ,	collumns : 5 			
	},
	{
 		id		: 'acryliclineart',
		network : "picasa" ,
		path	: "https://picasaweb.google.com/data/feed/base/user/GazowSilvaggi/albumid/5633279640159949377?alt=rss&kind=photo&hl=en_US",							
		rows 	: 1 ,	collumns : 8 			
	},
	{
		id		: 'sculpture',
		network : "picasa" ,
		path 	:"https://picasaweb.google.com/data/feed/base/user/GazowSilvaggi/albumid/5634270097324065697?alt=rss&kind=photo&hl=en_US",							
		rows 	: 1 ,	collumns : 5 		
	},
	{
 		id		: 'ink',
		network : "picasa" ,
		path	: "https://picasaweb.google.com/data/feed/base/user/GazowSilvaggi/albumid/5376834600467531089?alt=rss&kind=photo&hl=en_US",	
		rows 	: 1 ,	collumns : 6 				
	},
	{
 		id		: 'digitalphotography',
		network : "picasa" ,
		path	: "https://picasaweb.google.com/data/feed/base/user/GazowSilvaggi/albumid/5376835951806105265?alt=rss&kind=photo&authkey=Gv1sRgCKDg5YPAo46ZrwE&hl=en_US",	
		rows 	: 1 ,	collumns : 5 		
	},
	{
 		id		: 'blackandwhitephotography',
		network : "picasa" ,
		path	: "https://picasaweb.google.com/data/feed/base/user/GazowSilvaggi/albumid/5485444230393127729?alt=rss&kind=photo&hl=en_US",							
		rows 	: 1 ,	collumns : 6 		
	},
	{
 		id		: 'gestures',
		network : "picasa" ,
		path	: "https://picasaweb.google.com/data/feed/base/user/GazowSilvaggi/albumid/5376835000367090545?alt=rss&kind=photo&authkey=Gv1sRgCILd3qif_ubuowE&hl=en_US",							
		rows 	: 1 ,	collumns : 6 		
	}
];