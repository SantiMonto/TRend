document.addEventListener("DOMContentLoaded", function(event) {
    var button = document.getElementById("send_label");
    button.addEventListener("click",function(e){
    var request = new XMLHttpRequest();
    request.open('GET', '/verOrder', true);
    })
});