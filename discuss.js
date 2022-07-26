var submitQuestionNode=document.getElementById("submitBtn");
var questionTitleNode=document.getElementById("subject")
var  questionDescriptionNode=document.getElementById("question")
var  allQuestionListNode=document.getElementById("dataList")
var createQuestionFormNode=document.getElementById("toggleDisplay")
var questionDetailContainerNode=document.getElementById("respondQue")
var resolverQuestionContainerNode=document.getElementById("resolveHolder")
var resolverQuestionNode=document.getElementById("resolveQue")
var responseContainerNode=document.getElementById("respondAns")
var commentContainerNode=document.getElementById("commentHolder")
var commentorNameNode=document.getElementById("pickName")
var commentNameNode=document.getElementById("pickComment")
var submitCommentNode=document.getElementById("commentBtn")
var questionSearchNode=document.getElementById("questionSearch");
var up=document.getElementById("up")
var down=document.getElementById("down")
var twoBox=document.getElementById("rightContainer")
var newQuestionForm=document.getElementById("newQuestionForm")
var twoBox=document.getElementsByClassName("twoBox")


// on click newQuestionForm
newQuestionForm.onclick=function newQue(){
  questionDetailContainerNode.style.display = "none";
  resolverQuestionContainerNode.style.display = "none";
  commentContainerNode.style.display = "none";
  resolverQuestionNode.style.display = "none";
  responseContainerNode.innerHTML = "";
  createQuestionFormNode.style.display = "block";
    createQuestionFormNode.style.display = "block"

}
 

//search in question
questionSearch.addEventListener("keyup",function(event){
filterResult(event.target.value)
})

//function for search
function filterResult(query){
 if(query){
   allQuestionListNode.innerHTML="";
var allQuestion=getAllQuestion()
var result= allQuestion.filter(function(question)
{
if(question.title.includes(query))
 return true;
})
if(result.length)
{
 result.forEach(function(all){
   addQuestionToPanel(all);
 })
}
else
{
   allQuestionListNode.innerHTML="No match found";
}

}

else
{
allQuestionListNode.innerHTML=""
onLoad();
}
}

//get from storage
function onLoad()
{
   var allQuestion=getAllQuestion();
  // console.log(allQuestion)
  //  allQuestion.forEach(function(question)
  //  {
  //     addQuestionToPanel(question);
  //  })
  if(allQuestion!=null){
    if(allQuestion.length>1){
        allQuestion.sort(function(type1,type2){
            if(type1.fav)return -1;
            if(type2.fav)return 1;
        })
    }
    for(var i=0;i<allQuestion.length;i++){
    var question = allQuestion[i];
    addQuestionToPanel(question);

    }
}

}
onLoad();

//listen for the submit btn
submitQuestionNode.addEventListener("click",onQuestionSubmit);

function onQuestionSubmit()
{ 
    if(questionTitleNode.value.length > 0 && questionDescriptionNode.value.length > 0)
    {
 var question={
   title:questionTitleNode.value,
   description:questionDescriptionNode.value,
   responses:[],
   up:0,
   down:0,
   date: Date.now(),
   fav:false
 }
 saveQuestion(question);
 addQuestionToPanel(question);
 clearQuestionForm();
}
else
   alert("Both Field are Required");
}

//save question to storage
function saveQuestion(question)
{
 var allQuestion=getAllQuestion();
 allQuestion.push(question);
 
 var allData={
   data:JSON.stringify(allQuestion)
 }
 var req=new XMLHttpRequest();
 req.open("POST","https://storage.codequotient.com/data/save");
 req.setRequestHeader("Content-Type","application/json");
 req.send(JSON.stringify(allData));
req.addEventListener("load",function(){
  console.log(req.responseText);
})

saveToServer(allQuestion);
}

//get allquestion from storage
function getAllQuestion()
{
 var allQuestions=localStorage.getItem("questions");
 if(allQuestions){
   allQuestions=JSON.parse(allQuestions);
 }
 else
 {
   allQuestions=[]
 }

 return allQuestions;
}

//append question to the right side
function addQuestionToPanel(question){

  var container=document.createElement("div");
  container.setAttribute("class", "border border-secondary")
  container.style.cursor = "pointer";
  container.setAttribute("id",question.title);

    //adding 
    var duration=document.createElement("p")
    duration.innerHTML=timeAgo(duration)(question.date);
    duration.setAttribute("class","text-secondary")
    var icon=document.createElement("i")
    if(question.fav==false){
     
     icon.setAttribute("class","fa fa-heart-o fa-2x");
      }
      else
      {
         icon.setAttribute("class","fa fa-heart fa-2x");
      }
    
    icon.style.cursor = "grab";
    icon.setAttribute("id","icon");
    container.appendChild(icon);

  var title=document.createElement("h3")
  title.innerHTML=question.title;
  container.appendChild(title)
  


  var description=document.createElement("h5")
  description.innerHTML=question.description;
  container.appendChild(description)

  var created=document.createElement("lebel")
  created.innerHTML=`Created at :${new Date(question.date).toDateString()}`
  created.setAttribute("class","text-info")


  var upNode=document.createElement("p")
  upNode.setAttribute("class","text-primary")
  
  upNode.innerHTML="UpVote = "+question.up;
  container.appendChild(upNode)

   var downNode=document.createElement("p")
   downNode.setAttribute("class","text-danger")
  downNode.innerHTML="DownVote = "+question.down;
  container.appendChild(downNode)

  container.appendChild(created)
  container.appendChild(duration)


  allQuestionListNode.appendChild(container)

  container.addEventListener("click",onQuestionClick(question));
  icon.addEventListener("click",onFavClick(question));
  
}
//on fav click

function onFavClick(question)
{
 
  return function(event){
  event.stopPropagation();  
  if(question.fav==false){

  question.fav=true;
  }
  else
  {
    question.fav=false;
  }
  updateFav(question);
  showFav(question);
}
}

function updateFav(updated)
{
  var allQuestion=getAllQuestion()

  var onFav=allQuestion.map(function(question)
  {
          if(updated.title===question.title)
          {
            return updated;
          }
          return question;
  })

 saveToServer(onFav);
}

function showFav(question)
{
  var questionContainer=document.getElementById(question.title)
  console.log(questionContainer)
  if(question.fav==false){
   questionContainer.childNodes[0].setAttribute("class","fa fa-heart-o fa-2x")
    
    }
    else
    {
      questionContainer.childNodes[0].setAttribute("class","fa fa-heart fa-2x")
    }

}

//for time
function timeAgo(node){
  return function(time){
      setInterval(function(){
          node.innerHTML = "Created: " + createdAtTimer(time) + " ago";
      },1000);
      return `Created: ${createdAtTimer(time)} ago`;
  }
}

function createdAtTimer(time){
  var currTime = Date.now()-time;
  currTime/=1000;
  var result = parseInt(currTime/3600) + " hours : ";

  currTime = currTime%3600;
  result+= parseInt(currTime/60)  + " minutes : ";

  currTime = currTime%60;
  result+= parseInt(currTime) + " seconds ";
  return result; 
}

//clear questionForm
function clearQuestionForm()
{
   questionTitleNode.value="";
 questionDescriptionNode.value="";


}

//listen for click on question and display in right side
function onQuestionClick(question){
 
 return function(){
    var allQuestions = getAllQuestion();
   //hide question panel
   hideQuestionPanel();

   //clear last que
   clearQuestionDetails();
   
   //clear previous response
   clearResponsePanel()

   //show clicked question
   showQuestionDetail();

   //create question details
   addQuestionToRight(question);
   
   
   //show previous response
   var ques = allQuestions.filter((obj) => {
    return obj.title === question.title
        })
        
    showAllResponses(ques[0]);


   //listen to comment btn
   submitCommentNode.onclick=onResponseSubmit(question)
 
   up.onclick=upvote(question);
   down.onclick=downvote(question);

   resolverQuestionNode.onclick=questionResolved(question);
 }
}

function showAllResponses(question) {
    question.responses.forEach(function (response) {
        addResponseToPanel(response)
    })
}

// for resolve btn
function questionResolved(question)
{
 return function(){
  var allquestion=getAllQuestion();
//  var index;
  allquestion.forEach(function(all)
  {
    if(all.title==question.title)
  { var index=allquestion.indexOf(all);
    allquestion.splice(index,1);}
  })
 
 saveToServer(allquestion);
 refresh();
updateRightPanel();
 //  twoBox.innerHTML="Question is Resolved";

}
}

function updateRightPanel(){
  questionDetailContainerNode.style.display = "none";
  resolverQuestionContainerNode.style.display = "none";
  commentContainerNode.style.display = "none";
  resolverQuestionNode.style.display = "none";
  responseContainerNode.innerHTML = "";
  createQuestionFormNode.style.display = "block";
}
//refresh the list
function refresh(){
 allQuestionListNode.innerHTML="";
 onLoad();
}

//save to local storage
function saveToServer(result)
{
 localStorage.setItem("questions",JSON.stringify(result));
}

//for upvote
function upvote(question){

 return function(){
    question.up++;
 updatedQue(question);
  updateQuestionUI(question);
 }

}

//for downvote
function downvote(question){
 return function()
 {
    question.down++;
updatedQue(question);
updateQuestionUI(question);
 }

}

//updateQuestionUI
function updateQuestionUI(question)
{
 //get question from dom
 var questionContainer=document.getElementById(question.title)
 console.log(questionContainer)
 questionContainer.childNodes[3].innerHTML="UpVote = "+question.up;
 questionContainer.childNodes[4].innerHTML="DownVote = "+question.down;

}

//update 
function updatedQue(updated)
{
    var allQuestion=getAllQuestion()

  var revisedQue=allQuestion.map(function(question)
  {
          if(updated.title===question.title)
          {
            return updated;
          }
          return question;
  })

 saveToServer(revisedQue);
}


//listen for click on submit respose btn
function onResponseSubmit(question)
{
  return function()
  {  
    if (commentorNameNode.value.length > 0 && commentNameNode.value.length>0){
      var response={
        name:commentorNameNode.value,
        description:commentNameNode.value,
        time: Date.now(),
        fav:false
      }
      saveResponse(question,response);
      addResponseToPanel(response);

    //   clearResponsePanel()
    }
    else {
        alert("Both Field are Required")
    }
  }
}

//display response in response section
function addResponseToPanel(response)
{
// refresh();
 var container=document.createElement("div");
 container.setAttribute("id",response.name);
 var username = document.createElement("h4");
 username.innerHTML = response.name;


 var icon=document.createElement("i")
 if(response.fav==false){
  
  icon.setAttribute("class","fa fa-heart-o fa-2x");
   }
   else
   {
      icon.setAttribute("class","fa fa-heart fa-2x");
   }
 
 icon.style.cursor = "grab";
 icon.setAttribute("id","icon");
 container.appendChild(icon);

 var usercomment=document.createElement("p"); 
 usercomment.innerHTML=response.description ;
 var date = document.createElement("span");
 date.innerHTML = `Answered at: ${new Date(response.time).toLocaleString()}`;
 date.setAttribute("class","text-info")
  container.appendChild(username) ;
  container.appendChild(usercomment) ;
  container.appendChild(date)
  container.setAttribute("class","border border-secondary")

   responseContainerNode.appendChild(container);
   
   commentNameNode.value = "";
    
   commentorNameNode.value="" ;

   icon.addEventListener("click",onFavResponseClick(response));
}

//onFavResponseClick

function onFavResponseClick(response)
{
  return function(){ 
    var allquestion=getAllQuestion();   
    if(response.fav==false){
  
      response.fav=true;
    }
    else
    {
      response.fav=false;
    }
  
 //  updateResponseFav(response)
    showResponseFav(response);
  }
}

//updateResponseFav
function updateResponseFav(response)  // need some changes 
{ 

   var allQuestion=getAllQuestion();
  // console.log(allQuestion)
   var update=allQuestion.map(function(question)
   {
          if(question.responses.name===response.name)
          {
           var item=  question.responses.fav=response.fav;
          //  return question;
          console.log(question.responses.fav)
          }
          //  console.log(question.responses)
          //  console.log(response)

            return question;
     
   
   })
  // console.log(update)
  saveToServer(update)


}

// on show fav response
function showResponseFav(response)
{
  
  var responseContainer=document.getElementById(response.name)
 //  console.log(responseContainer)
 
       if(response.fav==false){
   responseContainer.childNodes[0].setAttribute("class","fa fa-heart-o fa-2x")
    
    }
    else
    {
      responseContainer.childNodes[0].setAttribute("class","fa fa-heart fa-2x")
    }

}
//hide question panel
function hideQuestionPanel()
{
    createQuestionFormNode.style.display="none"
}

//display question details

function showQuestionDetail()
{
   questionDetailContainerNode.style.display="block";
  resolverQuestionContainerNode.style.display="block";
  resolverQuestionNode.style.display="block";
 commentContainerNode.style.display="block";
  
}
// clicked question 
function addQuestionToRight(question)
{
  var container=document.createElement("div");
//   container.style.background="grey"
container.setAttribute("class", "border border-info")
  var title=document.createElement("h3")
  title.innerHTML=question.title;
  container.appendChild(title)


  var description=document.createElement("p")
  description.innerHTML=question.description;
  container.appendChild(description)

  questionDetailContainerNode.appendChild(container)
}

//for saving comment
function saveResponse(updated,response)
{
  var allQuestion=getAllQuestion()

  var revisedQue=allQuestion.map(function(question)
  {
          if(updated.title===question.title)
          {
            question.responses.push(response)
          }
          return question;
  })

 saveToServer(revisedQue);
}

function clearQuestionDetails(){
 questionDetailContainerNode.innerHTML=""
}

function clearResponsePanel()
{
 responseContainerNode.innerHTML="";
}