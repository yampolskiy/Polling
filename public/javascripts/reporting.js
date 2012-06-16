function log_event(event_name) {
	$.getJSON("http://localhost:8085/events/?callback=?"
		, { "event_name" : event_name }
		, function(data) {
			
		});	
}

log_event(_evt.pop());