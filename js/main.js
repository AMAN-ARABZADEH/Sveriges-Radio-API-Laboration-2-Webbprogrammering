// Denna fil innehåller lösningen till er uppgift.

/*
Moment 2 Mittuniversitet
Författare: Aman Arabzadeh
Kurs: Webbprogrammering
Datum: 2023-02-07
Lärare: Mikael Hasselmalm , Jan-Erik jonsson

/*
Källa: www.w3school.com
"use strict" i  JavaScript fungerar som  striktare analys och felhantering för att göra koden säkrare 
och mer robust genom att förhindra  oavsiktliga globala variabler, tillhandahålla bättre felmeddelanden och förbjuda vissa osäkra metoder. 

OBS: Mina kommentar kommer att vara på engelska då alla ska förstå koden. 
*/
"use strict";

// Global variable and selectors JS
const info = document.querySelector("#info");
const logo = document.querySelector("#logo");
const searchProgram = document.querySelector("#searchProgram");
const mainNavList = document.querySelector("#mainnavlist");
const searchButton = document.querySelector("#searchbutton");
// Size of the channals
const SizeDatafromAPI = 34;

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function (e) {
  e.preventDefault();
  const url =
    "http://api.sr.se/api/v2/channels?size=" + SizeDatafromAPI + "&format=json";

  // tHIS FUNCTION GETS THE DATA FROM URL

  // Use the fetch API to get data from the Sveriges Radio  URL
  fetch(url, { method: "GET" })
    .then((response) => response.text())
    .then((data) => {
      let jsonData = JSON.parse(data);
      //onsole.log(jsonData);

      // Loop to loop over the json and retrive data,
      //
      for (let i = 0; i < jsonData.channels.length; i++) {
        // Create img element and add the img from json and style and append to the mainnavlist as child
        let img = document.createElement("img");
        img.src = jsonData.channels[i].image;

        img.id = jsonData.channels[i].id;
        img.alt = "Radio Channal logo Sweden";
        img.style.width = "20px";
        img.style.height = "20px";
        img.style.marginRight = "10px";
        img.style.float = "left";
        // Append as child img in the unorded list  befor li for each
        // channel separate
        mainNavList.appendChild(img);
        // creat a li Sett the values in list with the id of the channel at pos i,
        // set the name to the mainNavlist to the left side of the screen in a list

        mainNavList.innerHTML +=
          "<li id='" +
          jsonData.channels[i].id +
          "'>" +
          jsonData.channels[i].name +
          "</li>";
        // creat option inside searchProgram select and add the id as value of option and name as the text to the right sid
        // of the screen
        searchProgram.innerHTML +=
          "<option value='" +
          jsonData.channels[i].id +
          "'>" +
          jsonData.channels[i].name +
          "</option>";
      }
    })
    .catch((error) => {
      // Error handling
      alert("There was an error " + error);
    });
  /*
    This code is used to remove all the child elements from the info element,
    which is a DOM element.  while (info.firstChild) continue remove the first child element of info
     as long as there is a first child element.
    I use this  to clear out all previous content inside an element, When the user clicks new program button
    in preparation for updating its content with new data.
   */
  function updatePage() {
    //console.log("Hello World!")
    while (info.firstChild) {
      info.removeChild(info.firstChild);
    }
  }

  //
  // Create eventlistener for click on search program
  searchButton.addEventListener("click", function (e) {
    const ID = searchProgram.value;
    e.preventDefault();
    updatePage(); /// clear out all previous content inside an element
    playAudio(ID);
    // console.log(searchProgram.value);
    const url =
      "https://api.sr.se/api/v2/scheduledepisodes?format=json&channelid=" + ID;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        for (let i = 0; i < data.pagination.size; i++) {
          let title = data.schedule[i].title;
          let descriptions = data.schedule[i].description;
          // Take the string date from API
          let startTime = data.schedule[i].starttimeutc;

          // Take out the useless chars
          let removeExtraChar = startTime.substring(6, startTime.length - 2);
          //console.log( removeExtraChar*1);
          // Heere I converte string data to number by multiplying by 1 does the work
          let convertTointeger = removeExtraChar * 1;
          // console.log(typeof convertTointeger);

          let new_time = new Date(convertTointeger);

          // Append to  info side of the site, title, description, the tim in UTC
          info.innerHTML += `<h1>${title}</h1>
          <h3>${descriptions}</h3>
          <p>${new_time}</p><hr>`;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });

  // Global variable to store the currently playing audio
  let currentAudio;
  function playAudio(currentID) {
    // Construct the URL for the audio
    const url =
      "http://sverigesradio.se/topsy/direkt/srapi/" + currentID + ".mp3";

    // Check if a current audio is already playing
    if (!currentAudio) {
      // If no current audio, create a new audio element with the URL
      currentAudio = new Audio(url);
    } else {
      // If a current audio is playing, pause it
      currentAudio.pause();
      // Update the source of the current audio to the new URL
      currentAudio.src = url;
    }

    // Play the current audio
    currentAudio.play();
  }
  let tempID; // Used to store current channalID that is used

  // Event listener for clicks on mainNavList
  mainNavList.addEventListener("click", function (e) {
    updatePage(); //clear out all previous content inside an element info

    // Get the id of the clicked element
    const channelid = e.target.id;
    let pos = 0;

    // Get the text content of the clicked element
    const newValue = e.target.textContent;

    // Loop through the options to find the matching text in option list
    while (pos <= searchProgram.options.length) {
      // If a match is found, set the selected index and break the loop
      if (searchProgram.options[pos].text == newValue) {
        searchProgram.selectedIndex = pos;
        break; // stop there
      }
      pos++;
    }

    playAudio(channelid);

    // URL for the tag line
    const tagLineUrl = "https://api.sr.se/api/v2/channels?size=45&format=json";

    // Fetch the tag line data
    fetch(tagLineUrl)
      .then((response) => response.json())
      .then((data) => {
        let position = 0;
        // Loop through the channels to find the matching id
        for (let i = 0; i < data.channels.length; i++) {
          if (channelid == data.channels[i].id) {
            position = i;
            tempID = channelid;
            break;
          }
        }
        // Store the name and tag line of the channel
        let names = data.channels[position].name;
        let tagLine = data.channels[position].tagline;

        // Update the inner HTML of the info element with the name and tag line
        info.innerHTML = `<h2>${names}</h2><h3>${tagLine}</h3><hr>`;

        // URL for the current, previous, and next songs
        const SongPreNext =
          "https://api.sr.se/api/v2/playlists/rightnow?format=json&channelid=" +
          tempID;

        // Fetch the song data
        fetch(SongPreNext)
          .then((response) => response.json())
          .then((data) => {
            // Create the element variables paragraph
            let prev = document.createElement("p");
            let next = document.createElement("p");
            let currentSong = document.createElement("p");

            // Check if previoussong exists and set its text content
            if ("previoussong" in data.playlist) {
              prev.textContent =
                "Previous Song: " + data.playlist.previoussong.description;
            } else {
              console.error("There is no previous song!");
            }

            // Check if current song exists and set its text content
            if ("song" in data.playlist) {
              currentSong.textContent =
                "Current Song: " + data.playlist.song.description;
            } else {
              console.error("There is no current song!");
            }

            // Check if nextsong exists and set its text content
            if ("nextsong" in data.playlist) {
              next.textContent =
                "Next Song: " + data.playlist.nextsong.description;
            } else {
              console.error("There is no next song!");
            }

            // Append the elements to the parent node
            info.append(prev, currentSong, next);
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  });
}); // End of
// const leapYear = (year) => {
//   if (year % 400 === 0) return true;
//   if (year % 100 === 0) return false;
//   return year % 4 === 0;
// };

// console.log((leapYear(2016)) ? "It is leap year! (= " : "Not leap year! )="); // true
// console.log((leapYear(2000)) ? "It is leap year! (= " : "Not leap year! )="); // true
// console.log((leapYear(1700)) ? "It is leap year! (= " : "Not leap year! )="); // false
// console.log((leapYear(1800)) ? "It is leap year! (= " : "Not leap year! )="); // false
// console.log((leapYear(100)) ? "It is leap year! (= " : "Not leap year! )="); // false
