/*
 * Forked from: https://blog.adam-marsden.co.uk/better-github-labels-f1360b43e0a7
 * Add or update or delete labels from list on GitHub repo or org settings.
 * Sample Repo URL: https://github.com/incendia-workspace/incredible-kiosk/labels
 * Sample Org Settings URL: https://github.com/organizations/incendia-workspace/settings/repository-defaults
 *
 * Tested successfully on: 2021/01/22 16:00
 */

// To add a new label or to update color or description of labels,
// - Each label object MUST have `name` field. `color` & `description` fields are optional & will be used if available.
// - Labels will be searched by `name` & values of `color` & `description` will be updated.
// - If label is not found by `name`, it'll be added.
//
// To update the name of a label, add `old-name` field.
// - If `old-name` field is present,
//   - Labels will be searched by `old-name` & values of `name`, `color` & `description` will be updated.
//
// Note:
// - For all objects, `color` & `description` default to "000000" & "" respectively.
// - If the object doesn't have `name`, it'll be skipped.
// - If the object has `old-name` but doesn't have `name`, it'll be skipped.
//
// WARNING !!
// - Ensure that all the objects have unqiue value for `name`. Any duplicates might cause the program to malfunction.
// - DO NOT remove the variables if not needed. Simply leave the array empty.

var labelsToAddOrUpdate = [
	/*
		{
			"name": "label-add-1",
			"description": "A label to add, it must not exist already",
			"color": "00ff00"
		},
		{
			"name": "label-add-2",
			"description": "A label to add, it must not exist already",
			"color": "00ff00"
		},
		{
			"name": "label-update-1",
			"description": "A label to update, color & description will be updated, it will be created if it doesn't exist",
			"color": "0000ff"
		},
		{
			"name": "label-update-2",
			"description": "A label to update, color & description will be updated, it will be created if it doesn't exist",
			"color": "0000ff"
		},
		{
			"old-name": "old-label-1",
			"name": "label-transform-1",
			"description": "A label to transform, name, color & description will be updated, it will be created if it doesn't exist",
			"color": "00ffff"
		},
		{
			"old-name": "old-label-2",
			"name": "label-transform-2",
			"description": "A label to transform, name, color & description will be updated, it will be created if it doesn't exist",
			"color": "00ffff"
		}
	*/
] ;

// Set this to true to delete old labels that are not present in the above list.
// WARNING !! Be careful this one. It will delete all labels not listed above.
//
// - If you want to just delete specific labels, see below.
// - DO NOT remove the variables if not needed. Simply mark it as false.
var deleteOldLabels = false ;

// List below the names of labels you wish to delete.
// Each label object MUST have `name` field. Other fields will be ignored.
//
// - If the object doesn't have `name`, it'll be skipped.
// - If `deleteOldLabels` is set to `true` above, this entire object will be skipped.
//
// WARNING !!
// - Ensure that all the objects have unqiue value for `name` & none exist in the above object. Any duplicates might cause the program to malfunction.
// - DO NOT remove the variables if not needed. Simply leave the array empty.
var labelsToDelete = [
	/*
		{
			"name": "label-del-1"
		},
		{
			"name": "label-del-2"
		},
		{
			"name": "label-del-3"
		}
	*/
] ;

/** Unless the code doesn't work, DO NOT edit below this line. **/

var labelRowSelector = ".js-labels-list-item" ;
var labelNameElemSelector = ".js-label-link" ;
var labelDescriptionElemSelector = ".js-hide-on-label-edit" ;
var labelEditButtonSelector = ".js-edit-label" ;
var labelNameInput = ".js-new-label-name-input" ;
var labelColorInput = ".js-new-label-color-input" ;
var labelDescriptionInput = ".js-new-label-description-input" ;
var labelEditSaveChangesSelector = "button.btn-primary" ;
var labelNewButtonSelector = ".js-details-target-new-label" ;
var labelNewRowSelector = ".js-create-label" ;
var labelDeleteButtonSelector = "form.js-delete-label button[type='submit']" ;

function deleteLabel ( label )
{
	var deleted = false ;

	document. querySelectorAll ( labelRowSelector ). forEach ( function ( element )
	{
		if ( deleted === false )
		{
			var labelName = element. querySelector ( labelNameElemSelector ) ;
			if ( labelName === null )
			{
				deleted = "cannot find name" ;
				return deleted ;
			}
			labelName = labelName. innerHTML. trim () ;
			labelName = labelName. replace (/<\/?span>/g, "") ; // Handles repo pages where label names are in a span

			if ( labelName === label. name )
			{
				var labelDelete = element. querySelector ( labelDeleteButtonSelector ) ;
				if ( labelDelete === null )
				{
					deleted = "cannot find delete" ;
					return  deleted;
				}
				labelDelete. removeAttribute ("data-confirm") ;
				labelDelete. click () ;

				deleted = true ;
			}
		}
		else
		{
			return ;
		}
	} ) ;

	return deleted ;
}

function deleteOldLabels ( cb )
{
	labelsFailedToDelete = 0 ;
	labelsDeleted = 0 ;

	var labelNamesToKeep = labelsToAddOrUpdate. map ( function ( l )
	{
		return l. name ;
	} ) ;

	var log = new Object () ;
	log ["failed-to-parse-name"] = 0 ;
	log ["failed-to-find-delete"] = new Array () ;
	log ["will-be-deleted"] = new Array () ;
	log ["deleted"] = new Array () ;
	var deleteButtons = new Array () ;
	document. querySelectorAll ( labelRowSelector ). forEach ( function ( element )
	{
		var deleted = false ;
		var labelName = element. querySelector ( labelNameElemSelector ) ;
		if ( labelName === null )
		{
			deleted = "cannot find name" ;
			log ["failed-to-parse-name"] += 1 ;
			return deleted ;
		}
		labelName = labelName. innerHTML. trim () ;
		labelName = labelName. replace (/<\/?span>/g, "") ; // Handles repo pages where label names are in a span

		if ( labelNamesToKeep. indexOf ( labelName ) === -1 )
		{
			var labelDelete = element. querySelector ( labelDeleteButtonSelector ) ;
			if ( labelDelete === null )
			{
				deleted = "cannot find delete" ;
				log ["failed-to-find-delete"]. push ( labelName ) ;
				labelsFailedToDelete += 1 ;
				return  deleted;
			}
			deleteButtons. push ( { labelDelete, labelName } ) ;
			log ["will-be-deleted"]. push ( labelName ) ;
		}
	} ) ;

	if ( log ["will-be-deleted"]. length > 0 )
	{
		console. warn ("The following " + log ["will-be-deleted"]. length + " labels will be deleted:") ;
		log ["will-be-deleted"]. forEach ( function ( labelName )
		{
			console. warn ("- " + labelName ) ;
		} ) ;
		var conf = prompt ("WARNING !! All the " + log ["will-be-deleted"]. length + " labels listed in the console will be DELETED. Are you sure you want to delete those labels ?? Type \"Yes, DELETE those.\" to confirm.") ;
		if ( conf === "Yes, DELETE those." )
		{
			deleteButtons. forEach ( function ( { labelDelete, labelName } )
			{
				labelDelete. removeAttribute ("data-confirm") ;
				labelDelete. click () ;

				deleted = true ;
				log ["deleted"]. push ( labelName ) ;
				labelsDeleted += 1 ;
			} ) ;
		}
		else
		{
			console. error ("Authorisation to delete labels failed. Cancelling delete operation.") ;
		}
	}
	else
	{
		console. log ("No labels to delete.") ;
	}

	oldLabelsDeleteLog = log ;
}

function updateLabel ( label )
{
	var updated = false ;

	if ( label ["old-name"] !== undefined )
	{
		label ["new-name"] = label. name ;
		label. name = label ["old-name"] ;
	}
	document. querySelectorAll ( labelRowSelector ). forEach ( function ( element )
	{
		if ( updated === false )
		{
			var labelName = element. querySelector ( labelNameElemSelector ) ;
			if ( labelName === null )
			{
				updated = "cannot find name" ;
				return updated ;
			}
			labelName = labelName. innerHTML. trim () ;
			labelName = labelName. replace (/<\/?span>/g, "") ; // Handles repo pages where label names are in a span

			if ( labelName === label. name )
			{
				if ( label ["old-name"] !== undefined )
				{
					label. name = label ["new-name"] ;
				}
				var labelEdit = element. querySelector ( labelEditButtonSelector ) ;
				if ( labelEdit === null )
				{
					updated = "cannot find edit" ;
					return  updated;
				}
				labelEdit. click () ;

				var labelSave = element. querySelector ( labelEditSaveChangesSelector ) ;
				if ( labelSave === null )
				{
					updated = "cannot find save" ;
					return  updated;
				}

				var labelNameInputElem = element. querySelector ( labelNameInput ) ;
				if ( labelNameInputElem === null )
				{
					labelSave. click () ;
					updated = "cannot find name input" ;
					return  updated;
				}

				var labelColorInputElem = element. querySelector ( labelColorInput ) ;
				if ( labelColorInputElem === null )
				{
					labelSave. click () ;
					updated = "cannot find color input" ;
					return  updated;
				}

				var labelDescriptionInputElem = element. querySelector ( labelDescriptionInput ) ;
				if ( labelDescriptionInputElem === null )
				{
					if ( label. description !== undefined )
					{
						labelSave. click () ;
						updated = "cannot find description input" ;
						return  updated;
					}
				}

				if ( label. color === undefined )
				{
					label. color = "000000" ;
				}
				if ( label. description === undefined )
				{
					if ( labelDescriptionInputElem !== null )
					{
						label. description = "" ;
					}
				}

				labelNameInputElem. value = label. name ;
				labelColorInputElem. value = "#" + label. color ;
				if ( label. description !== undefined )
				{
					labelDescriptionInputElem. value = label. description ;
				}

				labelSave. click () ;
				updated = true ;
			}
		}
		else
		{
			return ;
		}
	} ) ;

	return updated ;
}

function addNewLabel ( label )
{
	var added = false ;

	var labelNewButton = document. querySelector ( labelNewButtonSelector ) ;
	if ( labelNewButton === null )
	{
		added = "cannot find new label button" ;
		return added ;
	}
	labelNewButton. click () ;

	var labelNewRow = document. querySelector ( labelNewRowSelector ) ;
	if ( labelNewRow === null )
	{
		added = "cannot find new label row" ;
		return added ;
	}

	var labelSave = labelNewRow. querySelector ( labelEditSaveChangesSelector ) ;
	if ( labelSave === null )
	{
		added = "cannot find save" ;
		return  added;
	}

	var labelNameInputElem = labelNewRow. querySelector ( labelNameInput ) ;
	if ( labelNameInputElem === null )
	{
		labelSave. click () ;
		added = "cannot find name input" ;
		return  added;
	}

	var labelColorInputElem = labelNewRow. querySelector ( labelColorInput ) ;
	if ( labelColorInputElem === null )
	{
		labelSave. click () ;
		added = "cannot find color input" ;
		return  added;
	}

	var labelDescriptionInputElem = labelNewRow. querySelector ( labelDescriptionInput ) ;
	if ( labelDescriptionInputElem === null )
	{
		if ( label. description !== undefined )
		{
			labelSave. click () ;
			added = "cannot find description input" ;
			return  added;
		}
	}

	if ( label. color === undefined )
	{
		label. color = "000000" ;
	}
	if ( label. description === undefined )
	{
		if ( labelDescriptionInputElem !== null )
		{
			label. description = "" ;
		}
	}

	labelNameInputElem. value = label. name ;
	labelColorInputElem. value = "#" + label. color ;
	if ( label. description !== undefined )
	{
		labelDescriptionInputElem. value = label. description ;
	}

	labelSave. removeAttribute ("disabled") ;
	labelSave. click () ;
	added = true ;

	return added ;
}

function handleDeletion ()
{
	if ( deleteOldLabels === true )
	{
		deleteOldLabels ( printResults ) ;
	}
	else
	{
		var labelNamesToDelete = labelsToDelete. map ( function ( l )
		{
			return l. name ;
		} ) ;

		if ( labelNamesToDelete. length > 0 )
		{
			console. warn ("The following " + labelNamesToDelete. length + " labels will be deleted:") ;
			labelNamesToDelete. forEach ( function ( labelName )
			{
				console. warn ("- " + labelName ) ;
			} ) ;
			var conf = prompt ("WARNING !! All the " + labelNamesToDelete. length + " labels listed in the console will be DELETED. Are you sure you want to delete those labels ?? Type \"Yes, DELETE those.\" to confirm.") ;
			if ( conf === "Yes, DELETE those." )
			{
				labelsToDelete. forEach ( function ( label )
				{
					var d = deleteLabel ( JSON. parse ( JSON. stringify ( label ) ) ) ;
					if ( d === true )
					{
						labelsDeleted += 1 ;
						label. status = "Deleted" ;
					}
					else
					{
						labelsFailedToDelete += 1 ;
						if ( d === false )
						{
							d = "not found" ;
						}
						label. status = "Failed to delete: " + d ;
					}

					labelsAttemptedToDelete += 1 ;
				} ) ;
			}
			else
			{
				console. error ("Authorisation to delete labels failed. Cancelling delete operation.") ;
				labelsToDelete. forEach ( function ( label )
				{
					label. status = "Failed to delete: autorization revoked" ;
					labelsFailedToDelete += 1 ;
					labelsAttemptedToDelete += 1 ;
				} ) ;
			}
		}
		else
		{
			console. log ("No labels to delete.") ;
		}
	}
}

function printResults ()
{
	console. log ("") ;
	console. log ("totalLabelsToAddOrUpdate: " + totalLabelsToAddOrUpdate ) ;
	console. log ("totalLabelsToDelete: " + totalLabelsToDelete ) ;
	console. log ("labelsAttemptedToAddOrUpdate: " + labelsAttemptedToAddOrUpdate ) ;
	console. log ("labelsAttemptedToDelete: " + labelsAttemptedToDelete ) ;
	console. log ("") ;
	console. log ("labelsAdded: " + labelsAdded ) ;
	console. log ("labelsUpdated: " + labelsUpdated ) ;
	console. log ("labelsTransformed: " + labelsTransformed ) ;
	console. log ("labelsDeleted: " + labelsDeleted ) ;
	console. log ("labelsAddedNotTransformed: " + labelsAddedNotTransformed ) ;
	console. log ("") ;
	console. log ("labelsSkippedForTransformation: " + labelsSkippedForTransformation ) ;
	console. log ("labelsSkippedForAddOrUpdate: " + labelsSkippedForAddOrUpdate ) ;
	console. log ("") ;
	console. log ("labelsFailedToUpdate: " + labelsFailedToUpdate ) ;
	console. log ("labelsFailedToAdd: " + labelsFailedToAdd ) ;
	console. log ("labelsFailedToDelete: " + labelsFailedToDelete ) ;
	console. log ("transformLabelsFailedToAdd: " + transformLabelsFailedToAdd ) ;
	console. log ("") ;
	console. log ( labelsToAddOrUpdate ) ;
	console. log ( labelsToDelete ) ;
	console. log ( oldLabelsDeleteLog ) ;
}

var totalLabelsToAddOrUpdate = labelsToAddOrUpdate. length ;
var totalLabelsToDelete = labelsToDelete. length ;
var labelsAttemptedToAddOrUpdate = 0 ;
var labelsAttemptedToDelete = 0 ;

var labelsAdded = 0 ;
var labelsUpdated = 0 ;
var labelsTransformed = 0 ;
var labelsDeleted = 0 ;
var labelsAddedNotTransformed = 0 ;

var labelsSkippedForTransformation = 0 ;
var labelsSkippedForAddOrUpdate = 0 ;

var labelsFailedToUpdate = 0 ;
var labelsFailedToAdd = 0 ;
var labelsFailedToDelete = 0 ;
var transformLabelsFailedToAdd = 0 ;

var oldLabelsDeleteLog = {
	"status": "not-enabled"
} ;

labelsToAddOrUpdate. forEach ( function ( label )
{
	labelsAttemptedToAddOrUpdate += 1 ;

	if ( label ["old-name"] !== undefined )
	{
		if ( label ["name"] === undefined )
		{
			labelsSkippedForTransformation += 1 ;

			if ( labelsAttemptedToAddOrUpdate === totalLabelsToAddOrUpdate )
			{
				handleDeletion () ;
			}
			return ;
		}
	}
	else
	{
		if ( label ["name"] === undefined )
		{
			labelsSkippedForAddOrUpdate += 1 ;

			if ( labelsAttemptedToAddOrUpdate === totalLabelsToAddOrUpdate )
			{
				handleDeletion () ;
			}
			return ;
		}
	}

	var u = updateLabel ( JSON. parse ( JSON. stringify ( label ) ) ) ;
	if ( u === true )
	{
		if ( label ["old-name"] === undefined )
		{
			labelsUpdated += 1 ;
			label. status = "Updated" ;
		}
		else
		{
			labelsTransformed += 1 ;
			label. status = "Transformed" ;
		}
	}
	// Any other value means there was an error.
	else if ( u === false )
	{
		var a = addNewLabel ( JSON. parse ( JSON. stringify ( label ) ) ) ;
		if ( a === true )
		{
			labelsAdded += 1 ;
			label. status = "Added" ;
		}
		else if ( a === "a-not-t" )
		{
			labelsAddedNotTransformed += 1 ;
			label. status = "Added, transform requested" ;
		}
		else
		{
			if ( label ["old-name"] !== undefined )
			{
				transformLabelsFailedToAdd += 1 ;
				label. status = "Failed to add, transform requested: " + a ;
			}
			else
			{
				labelsFailedToAdd += 1 ;
				label. status = "Failed to add: " + a ;
			}
		}
	}
	else
	{
		labelsFailedToUpdate += 1 ;
		if ( label ["old-name"] === undefined )
		{
			label. status = "Failed to update: " + u ;
		}
		else
		{
			label. status = "Failed to transform: " + u ;
		}
	}
} ) ;
handleDeletion () ;
printResults () ;
