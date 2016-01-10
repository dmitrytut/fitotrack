namespace fitotrack.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class EditLogTable : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Logs", "LogLevel", c => c.String(nullable: false));
            AddColumn("dbo.Logs", "ExceptionString", c => c.String());
            AlterColumn("dbo.Logs", "Message", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Logs", "Message", c => c.String());
            DropColumn("dbo.Logs", "ExceptionString");
            DropColumn("dbo.Logs", "LogLevel");
        }
    }
}
