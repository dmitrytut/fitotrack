namespace fitotrack.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class LogUserIdDeleteMigration : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Logs", "CreateUserId", "dbo.UserProfiles");
            DropIndex("dbo.Logs", new[] { "CreateUserId" });
            DropColumn("dbo.Logs", "CreateUserId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Logs", "CreateUserId", c => c.Int(nullable: false));
            CreateIndex("dbo.Logs", "CreateUserId");
            AddForeignKey("dbo.Logs", "CreateUserId", "dbo.UserProfiles", "UserId", cascadeDelete: true);
        }
    }
}
