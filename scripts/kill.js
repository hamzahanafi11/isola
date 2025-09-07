fetch('/rooms-alive')
	.then(res => res.json())
	.then(data => {
        const tbody = document.querySelector("#roomsTable tbody");
        data.forEach(room => {
          const row = document.createElement("tr");

          // Room name cell
          const nameCell = document.createElement("td");
          nameCell.textContent = room.name;
          row.appendChild(nameCell);

          // Players cell
          const playersCell = document.createElement("td");
          playersCell.textContent = room.players.join(", ");
          row.appendChild(playersCell);

          tbody.appendChild(row);
        });
      })
      .catch(err => console.error("Error fetching rooms:", err));