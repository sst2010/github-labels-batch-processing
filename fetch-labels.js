/*
 * Forked from: https://blog.adam-marsden.co.uk/better-github-labels-f1360b43e0a7
 * Dump labels list from GitHub repo or org settings.
 * Sample Repo URL: https://github.com/incendia-workspace/incredible-kiosk/labels
 * Sample Org Settings URL: https://github.com/organizations/incendia-workspace/settings/repository-defaults
 *
 * Tested successfully on: 2021/01/22 16:00
 */

/** Unless the code doesn't work, DO NOT edit below this line. **/

function parseLabelColor ( color )
{
	// Color format on GitHub:
	// --label-r:233;--label-g:150;--label-b:149;--label-h:0;--label-s:65;--label-l:74;

	var r = "" ;
	var g = "" ;
	var b = "" ;

	try
	{
		color = color. split (";") ;
		r = ( "00" + ( parseInt ( color [ 0 ]. match (/\d+/g) [ 0 ] ). toString ( 16 ) ) ). substr ( -2 ) ;
		g = ( "00" + ( parseInt ( color [ 1 ]. match (/\d+/g) [ 0 ] ). toString ( 16 ) ) ). substr ( -2 ) ;
		b = ( "00" + ( parseInt ( color [ 2 ]. match (/\d+/g) [ 0 ] ). toString ( 16 ) ) ). substr ( -2 ) ;
	}
	catch ( error )
	{
		// Ignoring error
	}

	return r + g + b ;
}

var labels = new Array () ;
var labelRowSelector = ".js-labels-list-item" ;
var labelNameElemSelector = ".js-label-link" ;
var labelDescriptionElemSelector = ".js-hide-on-label-edit" ;

var labelRowsFound = 0 ;
var labelNamesParsed = 0 ;
var labelColorsParsed = 0 ;
var labelDescriptionsParsed = 0 ;
var labelsWithoutDescription = 0 ;
document. querySelectorAll ( labelRowSelector ) .forEach ( function ( element )
{
	labelRowsFound += 1 ;

	var labelName = element. querySelector ( labelNameElemSelector ) ;
	var labelDescription = element. querySelector ( labelDescriptionElemSelector ) ;
	var labelColor = undefined ;

	if ( labelName === null )
	{
		labelName = undefined ;
	}
	else
	{
		labelColor = parseLabelColor ( labelName. getAttribute ("style") ) ;
		if ( labelColor. length === 6 )
		{
			labelColorsParsed += 1 ;
		}

		labelName = labelName. innerHTML. trim () ;
		labelName = labelName. replace (/<\/?span>/g, "") ; // Handles repo pages where label names are in a span

		labelNamesParsed += 1 ;
	}
	if ( labelDescription === null )
	{
		labelDescription = undefined ;
	}
	else
	{
		labelDescription = labelDescription. innerHTML. trim () ;
		labelDescription = labelDescription. replace (/<\/?span>/g, "") ; // Handles non-blank descriptions by dumping them without span

		labelDescriptionsParsed += 1 ;
		if ( labelDescription === "" )
		{
			labelsWithoutDescription += 1 ;
		}
	}

	labels. push (
	{
		"name": labelName,
		"description": labelDescription,
		"color": labelColor
	} ) ;
} ) ;

var labelsString = JSON. stringify ( labels, null, 4 ) ;
copy ( labelsString ) ;
console. log ( labelsString ) ;
console. log ("") ;

console. log ("- Total labels found: " + labelRowsFound ) ;
console. log ("  - Error finding names of " + ( labelRowsFound - labelNamesParsed ) + " labels.") ;
console. log ("  - Error finding colors of " + ( labelRowsFound - labelColorsParsed ) + " labels.") ;
console. log ("  - Error finding description of " + ( labelRowsFound - labelDescriptionsParsed ) + " labels.") ;
console. log ("- Total labels found with empty description: " + labelsWithoutDescription ) ;
console. log ("") ;

console. log ("List of " + labels. length + " labels copied to clipboard !!") ;
console. log ("") ;

console. warn ("If label name & color fields contain values like \"undefined\", this most likely means that GitHub has updated their front-end architecture & this code will no longer work.") ;
console. warn ("- Although, it might be possible to fix the code easily by merely updating the used selectors.") ;
console. warn ("- Also, note that description might be undefined if not defined at all.") ;
