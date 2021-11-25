export default class Controllers {
  constructor() {
    document.addEventListener('click',(event)=>{
      console.log(event.path[0].id)
    }) 
  }
}
