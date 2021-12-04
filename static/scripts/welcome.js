function myFunc(parameter,flag) 
{
    var data=JSON.parse(parameter);
    len=data["data"].length;
    if(flag!=2)
    {
        var div=document.getElementById("dvTable");
        div.classList.add("container1");
        for(var i=0;i<len;i++)
        {
            var div1=document.createElement("div");
            div1.classList.add("as");
            div1.innerHTML=data["data"][i][4]+' '+data["data"][i][5];
            div.appendChild(div1);
        }
    }
    else
    {
        var div=document.getElementById("dvTable");
        var form=document.createElement("form");
        form.action="welcomeAfterTeam";
        form.method="POST"
        var div1=document.createElement("div");
        div1.classList.add("container1");
        for(var i=0;i<len;i++)
        {
            if(data["data"][i][2]==0)
            {
                var div2=document.createElement("div");
                div2.classList.add("as");
                var label=document.createElement("label");
                label.classList.add("dropdown");
                label.innerHTML=data["data"][i][4]+' '+data["data"][i][5];
                div2.appendChild(label);
                var select=document.createElement("select");
                select.id="options";
                select.name=data["data"][i][0];
                var options1=document.createElement("option");
                options1.value="1";
                options1.innerHTML="Team 1";
                select.appendChild(options1);
                var options2=document.createElement("option");
                options2.value="2";
                options2.innerHTML="Team 2";
                select.appendChild(options2);
                var options3=document.createElement("option");
                options3.value="3";
                options3.innerHTML="Team 3";
                select.appendChild(options3);
                var options4=document.createElement("option");
                options4.value="4";
                options4.innerHTML="Team 4";
                select.appendChild(options4);
                div2.appendChild(select);
                div1.appendChild(div2);
            }
        }
        form.appendChild(div1);
        var input=document.createElement("input");
        input.type="submit";
        input.value="Create Team";
        form.appendChild(input);
        div.appendChild(form);
    }
}
function teamfun(parameter,flag) 
{
    var data=JSON.parse(parameter);
    len=data["data"].length;
    if(flag!=0)
    {
        var div=document.getElementById("dvTable");
        div.classList.add("container2");
        var div1=document.createElement("div");
        div1.classList.add("sa");
        var string="Team "+String(flag)+"<br><br>";
        count=1
        for(var i=0;i<len;i++)
        {
            if(data["data"][i][3]==flag)
            {
                string+=String(count)+". "+data["data"][i][1]+" "+data["data"][i][2]+"<br>";
                count+=1;
            }
        }
        div1.innerHTML=string.link("empathize");
        div.appendChild(div1);
    }
    else
    {
        var div=document.getElementById("dvTable");
        div.classList.add("container2");
        for(var j=1;j<5;j++)
        {
            var flagforteam=0;
            var div1=document.createElement("div");
            div1.classList.add("sa");
            var string="Team "+String(j)+"<br><br>";
            count=1
            for(var i=0;i<len;i++)
            {
                if(data["data"][i][3]==j)
                {
                    string+=String(count)+". "+data["data"][i][1]+" "+data["data"][i][2]+"<br>";
                    count+=1;
                    flagforteam=1;
                }
            }
            div1.innerHTML=string;
            if(flagforteam)
            {
                div1.innerHTML=string.link("empathize");
                div.appendChild(div1);
            }
        }
    }
}