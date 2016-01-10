namespace fitotrack.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FoodCascadeDeleteTrue : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Foods", "CreateUserId", "dbo.UserProfiles");
            AddForeignKey("dbo.Foods", "CreateUserId", "dbo.UserProfiles", "UserId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Foods", "CreateUserId", "dbo.UserProfiles");
            AddForeignKey("dbo.Foods", "CreateUserId", "dbo.UserProfiles", "UserId");
        }
    }
}
