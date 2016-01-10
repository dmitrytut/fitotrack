namespace fitotrack.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FoodCreateUserIdSetToNullable2 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Exercises", "CreateUserId", "dbo.UserProfiles");
            DropIndex("dbo.Exercises", new[] { "CreateUserId" });
            AlterColumn("dbo.Exercises", "CreateUserId", c => c.Int());
            CreateIndex("dbo.Exercises", "CreateUserId");
            AddForeignKey("dbo.Exercises", "CreateUserId", "dbo.UserProfiles", "UserId");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Exercises", "CreateUserId", "dbo.UserProfiles");
            DropIndex("dbo.Exercises", new[] { "CreateUserId" });
            AlterColumn("dbo.Exercises", "CreateUserId", c => c.Int(nullable: false));
            CreateIndex("dbo.Exercises", "CreateUserId");
            AddForeignKey("dbo.Exercises", "CreateUserId", "dbo.UserProfiles", "UserId", cascadeDelete: true);
        }
    }
}
