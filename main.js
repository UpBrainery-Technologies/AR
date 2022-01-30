var firebaseConfig = {
  apiKey: "AIzaSyD72L_rL7tyFUSe6SntG1HbXtXII9USf_E",
  authDomain: "booklet-ar.firebaseapp.com",
  projectId: "booklet-ar",
  storageBucket: "booklet-ar.appspot.com",
  messagingSenderId: "358726433362",
  appId: "1:358726433362:web:ccca519510c96cfb773d8b"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

  let storage = firebase.storage();
//Do not modify code above is for connecting firebase storage
//
//

  let queryString =  decodeURIComponent(window.location.search);
  
  let folderPath = queryString.split('=');
  let mainScene = document.getElementById('mainScene');

  let modelsArr = [];
  

  //reference for the folder of the models
  let storageRef = storage.ref(folderPath[1]);
  let pattRef = storage.ref();
  let modelRef = storage.ref();


    storageRef.listAll().then(res => {
      res.prefixes.forEach(folderRef => {
        // All the prefixes under listRef.
      folderRef.listAll().then(res =>{
        let id = Math.floor((Math.random() * 100) + 1)
        console.log(res);
          pattRef.child(res.items[1].fullPath).getDownloadURL().then(url=>{
            let pattUrl = url.split("&");
             createAMarker(pattUrl[0],id);
          }).
          then(()=>{
            modelRef.child(res.items[0].fullPath).getDownloadURL().then(url=>{
              let modelUrl = url.split("&");
               createAEntity(modelUrl[0],id);
            }).catch(err=>{ console.log(err)});
          })
          .catch(err=>{ console.log(err)});

      });
        // You may call listAll() recursively on them.
      });
    }).catch( err =>{
      // Uh-oh, an error occurred!
      console.log(err);
    });

   function createAMarker(url,id){
     let markerElement = document.createElement('a-marker');
     markerElement.setAttribute('preset','custom');
     markerElement.setAttribute('type','pattern');
     markerElement.setAttribute('url',url);
     markerElement.setAttribute('raycaster','objects: .clickable');
     markerElement.setAttribute('emitevents','true');
     markerElement.setAttribute('cursor','fuse: false; rayOrigin: mouse;');
     markerElement.setAttribute('id',id);
     mainScene.prepend(markerElement);
   }

   function createAEntity(url,id){
     let entityElement = document.createElement('a-entity');
     entityElement.setAttribute('position','.05 0 0');
     entityElement.setAttribute('scale','1 1 1');
     entityElement.setAttribute('rotation','0 0 0');
     entityElement.setAttribute('gltf-model',url);
     entityElement.setAttribute('class','clickable');
     entityElement.setAttribute('gesture-handler','minScale: 0.25; maxScale: 10');
     let parentMarker = document.getElementById(id);
     parentMarker.appendChild(entityElement);
   }
