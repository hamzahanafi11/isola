// Handle form submission
$('#join-room-form').on('submit', function(e){
	e.preventDefault();

	const username = $('#username').val().trim();
	const roomName = $('#roomName').val().trim();

	if(!username && !roomName){
		alert('Please type your room/username');
	}

	window.location.href = '/game?username='+ username +'&roomName='+roomName;
});