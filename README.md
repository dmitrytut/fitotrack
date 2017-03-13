Fitotrack
---------------

Fitotrack is a system which helps you to: 

* Track your daily meals. 
  You can see not only caloricity of your meals, but also a nutrition 
  information about it.

* Plan your meals.
  With Fitotrack you can plan your meals for the future period.

* Track your daily activities. 
  You can see how many calories did you burn doing different activities.
  
* Set and track your own goal. 
  Whether you want to lose, gain weight or even maintain it, you can set the 
  goal and Fitotrack will calculate daily caloricity income recommended for 
  your body parameters and estimate approximate date for achieving the goal.
  
* Watch and analize statistics.


Used technologies:

ASP.Net MVC/Web Api, AngularJS, Entity Framework, MS SQL etc.


*** Deployment

1. Publish code to your webserver.
2. Create MSSql database, then make initial EF migrations. 
3. Edit connection strings in the ```web.config``` file.
4. Register FatSecret api site: http://platform.fatsecret.com/api/
4. Set `ConsumerKey` and `ConsumerSecret` in the ```fitotrack/api/FatSecretAPI/FatSecretAPI.cs``` with values from the step above.
5. That's it!


Demo site:

http://dmitrytut-001-site1.btempurl.com/      (Permanently unavaible)

