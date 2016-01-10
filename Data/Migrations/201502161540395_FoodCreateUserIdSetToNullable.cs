namespace fitotrack.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FoodCreateUserIdSetToNullable : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Foods", "CreateUserId", "dbo.UserProfiles");
            DropIndex("dbo.Foods", new[] { "CreateUserId" });
            AlterColumn("dbo.Foods", "CreateUserId", c => c.Int());
            CreateIndex("dbo.Foods", "CreateUserId");
            AddForeignKey("dbo.Foods", "CreateUserId", "dbo.UserProfiles", "UserId");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Foods", "CreateUserId", "dbo.UserProfiles");
            DropIndex("dbo.Foods", new[] { "CreateUserId" });
            AlterColumn("dbo.Foods", "CreateUserId", c => c.Int(nullable: false));
            CreateIndex("dbo.Foods", "CreateUserId");
            AddForeignKey("dbo.Foods", "CreateUserId", "dbo.UserProfiles", "UserId", cascadeDelete: true);
        }
    }
}
