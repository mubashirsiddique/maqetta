dojo.provide("davinci.ui.widgets.ResourceTreeModel");
dojo.require("davinci.resource");


dojo.declare("davinci.ui.widgets.ResourceTreeModel",null, {
	
   foldersOnly : false,
		
	constructor: function(args){
			this.root=davinci.resource.getRoot();
			this.subscription=[];
			this.subscription.push(dojo.subscribe("/davinci/resource/resourceChanged",this,this.resourceChanged));
			this.subscription.push(dojo.subscribe("/davinci/resource/workspaceChanged",this,this.workspaceChanged));
			this.foldersOnly=args && args.foldersOnly;
	},
	
	workspaceChanged : function(){
		this.root=davinci.resource.getRoot();
		this.root.getChildren(dojo.hitch(this,function(children){
												this.onChildrenChange(this.root,children)
											   }
		                                 ));
		
	},
	
	destroy: function(){
		for(var i=0;i<this.subscriptions.length;i++)
			dojo.unsubscribe(this.subscription[i]);
	},
	
	// =======================================================================
	// Methods for traversing hierarchy
	
	getRoot: function(onItem){
		onItem(this.root);
	},
	
	mayHaveChildren: function(/*dojo.data.Item*/ item){
       return item.elementType=="Folder";
		
	},
	
	getChildren: function(/*dojo.data.Item*/ parentItem, /*function(items)*/ onComplete){
		if (!this.foldersOnly)
		{
			parentItem.getChildren(onComplete, true); // need to make the call sync, chrome is to fast for async
		}
		else
		{
			parentItem.getChildren(function (items){
				var children=[]
				for (var i=0;i<items.length;i++)
					if (items[i].elementType=="Folder")
						children.push(items[i]);
				onComplete(children);
			});
		}
			
	},
	
	// =======================================================================
	// Inspecting items
	
	getIdentity: function(/* item */ item){
	
		return item.getPath();
	},
	
	getLabel: function(/*dojo.data.Item*/ item){
		
		var label=item.getName();
		if (item.link)
			label=label+'  ['+item.link+']';
		return label;
	},
	
	resourceChanged : function(type,changedResource)
	{
		if (type=='created'||type=='deleted'||type=='renamed')
		{
			var parent=changedResource.parent;
			var newChildren;
			parent.getChildren(function(children){newChildren=children});
			this.onChildrenChange(parent,newChildren);
		}
	},
	
	newItem: function(/* Object? */ args, /*Item?*/ parent){
	},
	
	pasteItem: function(/*Item*/ childItem, /*Item*/ oldParentItem, /*Item*/ newParentItem, /*Boolean*/ bCopy){
	},
	
	
	onChange: function(/*dojo.data.Item*/ item){
	},
	
	onChildrenChange: function(/*dojo.data.Item*/ parent, /*dojo.data.Item[]*/ newChildrenList){
	}
});

