// Saves options to chrome.storage
var preferences = null;
function save_options() {
  chrome.storage.sync.set(preferences, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function addEnpoint(parent, endpoint) {
  var row = document.createElement('tr');
  parent.appendChild(row);
  row.setAttribute('class', 'row"');
  var td = document.createElement('td');
  row.appendChild(td);
  td.setAttribute('class', 'col');
  td.appendChild(document.createTextNode(endpoint.url));
  td = document.createElement('td');
  row.appendChild(td);
  td.setAttribute('class', 'col');
  var checkbox = document.createElement('input');
  td.appendChild(checkbox);
  checkbox.type = 'checkbox';
  checkbox.checked = endpoint.active;
  checkbox.onclick = () => setActive(endpoint);
  td = document.createElement('td');
  row.appendChild(td);
  td.setAttribute('class', 'col');
  if (!endpoint.readonly) {
    var button = document.createElement('button');
    button.appendChild(document.createTextNode('Delete'));
    button.setAttribute('class', 'btn btn-primary');
    td.appendChild(button);
    button.onclick = () => removeEndpoint(endpoint);
  }
}

function refresh() {
	  var element = document.getElementById('url');
    if (element) {
      element.innerHTML = '';
      for(var i in preferences.endpoints) {
        addEnpoint(element, preferences.endpoints[i]);
      }
    }
}

function loadPreferences(cb) {
  chrome.storage.sync.get({
    endpoints: [{url: 'https://che.openshift.io', active:true, readonly: true}]
  }, cb);
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  loadPreferences(function(items) {
	  preferences = items;
	  refresh();
  });
}

function newEndpoint() {
	var el = document.getElementById('newEndpoint');
	if (el !== null) {
    preferences.endpoints.forEach(element => {
      element.active = false;
    });
		preferences.endpoints.push({url: el.value, active: true, readonly: false});
    refresh();
    save_options();
	}
}

function removeEndpoint(endpoint) {
  var index = preferences.endpoints.indexOf(endpoint);
  preferences.endpoints.splice(index, 1);
  if (endpoint.active) {
    preferences.endpoints[0].active = true;
  }
  refresh();
  save_options();
}

function setActive(endpoint) {
  preferences.endpoints.forEach(element => element.active = false);
  endpoint.active = true;
  refresh();
  save_options();
}

function getSelectedEnpoint(cb) {
  if (preferences) {
    cb(preferences.endpoints.filter(element => element.active)[0].url);
  } else {
    loadPreferences(items => {
      preferences = items;
      cb(preferences.endpoints.filter(element => element.active)[0].url);
    });
  }
}

restore_options();
el = document.getElementById('new');
if (el) {
  el.addEventListener('click',
  newEndpoint);
}
