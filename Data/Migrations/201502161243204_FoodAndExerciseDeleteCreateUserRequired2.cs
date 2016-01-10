namespace fitotrack.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FoodAndExerciseDeleteCreateUserRequired2 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.BodyParameters",
                c => new
                    {
                        BodyParametersId = c.Int(nullable: false, identity: true),
                        Date = c.DateTime(nullable: false),
                        Neck = c.Decimal(precision: 18, scale: 2),
                        Chest = c.Decimal(precision: 18, scale: 2),
                        Shoulders = c.Decimal(precision: 18, scale: 2),
                        Waist = c.Decimal(precision: 18, scale: 2),
                        Arms = c.Decimal(precision: 18, scale: 2),
                        Forearms = c.Decimal(precision: 18, scale: 2),
                        Hip = c.Decimal(precision: 18, scale: 2),
                        Thigs = c.Decimal(precision: 18, scale: 2),
                        Calves = c.Decimal(precision: 18, scale: 2),
                        BodyFatPercent = c.Decimal(precision: 18, scale: 2),
                        CreateUserId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.BodyParametersId)
                .ForeignKey("dbo.UserProfiles", t => t.CreateUserId, cascadeDelete: true)
                .Index(t => t.CreateUserId);
            
            CreateTable(
                "dbo.UserProfiles",
                c => new
                    {
                        UserId = c.Int(nullable: false),
                        UserImagePath = c.String(),
                        FullName = c.String(nullable: false, maxLength: 250),
                        Gender = c.Int(),
                        DateOfBirth = c.DateTime(),
                        Location = c.String(maxLength: 250),
                        Height = c.Decimal(precision: 18, scale: 2),
                        ActivityLevel = c.Int(),
                        PrivacyFlag = c.Int(nullable: false),
                        Status = c.String(maxLength: 250),
                    })
                .PrimaryKey(t => t.UserId)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUsers",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Email = c.String(maxLength: 256),
                        EmailConfirmed = c.Boolean(nullable: false),
                        PasswordHash = c.String(),
                        SecurityStamp = c.String(),
                        PhoneNumber = c.String(),
                        PhoneNumberConfirmed = c.Boolean(nullable: false),
                        TwoFactorEnabled = c.Boolean(nullable: false),
                        LockoutEndDateUtc = c.DateTime(),
                        LockoutEnabled = c.Boolean(nullable: false),
                        AccessFailedCount = c.Int(nullable: false),
                        UserName = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.UserName, unique: true, name: "UserNameIndex");
            
            CreateTable(
                "dbo.AspNetUserClaims",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.Int(nullable: false),
                        ClaimType = c.String(),
                        ClaimValue = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserLogins",
                c => new
                    {
                        LoginProvider = c.String(nullable: false, maxLength: 128),
                        ProviderKey = c.String(nullable: false, maxLength: 128),
                        UserId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.LoginProvider, t.ProviderKey, t.UserId })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserRoles",
                c => new
                    {
                        UserId = c.Int(nullable: false),
                        RoleId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.UserId, t.RoleId })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetRoles", t => t.RoleId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.RoleId);
            
            CreateTable(
                "dbo.FoodDiaryEntries",
                c => new
                    {
                        FoodDiaryEntryId = c.Int(nullable: false, identity: true),
                        MealTimeIndex = c.Int(nullable: false),
                        FoodId = c.Long(nullable: false),
                        FsSelectedServingId = c.Long(nullable: false),
                        FtSelectedServingId = c.Long(nullable: false),
                        FoodQty = c.Decimal(nullable: false, precision: 18, scale: 2),
                        IsCompleted = c.Boolean(nullable: false),
                        Date = c.DateTime(nullable: false),
                        CreationTime = c.DateTime(nullable: false),
                        CreateUserId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.FoodDiaryEntryId)
                .ForeignKey("dbo.UserProfiles", t => t.CreateUserId)
                .ForeignKey("dbo.Foods", t => t.FoodId, cascadeDelete: true)
                .Index(t => t.FoodId)
                .Index(t => t.CreateUserId);
            
            CreateTable(
                "dbo.Foods",
                c => new
                    {
                        FoodId = c.Long(nullable: false, identity: true),
                        Title = c.String(nullable: false, maxLength: 255),
                        Type = c.String(nullable: false, maxLength: 32),
                        BrandType = c.String(maxLength: 32),
                        BrandTitle = c.String(maxLength: 255),
                        FSFoodId = c.Long(nullable: false),
                        FSUrl = c.String(),
                        Barcode = c.String(maxLength: 13),
                        CreationTime = c.DateTime(nullable: false),
                        CreateUserId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.FoodId)
                .ForeignKey("dbo.UserProfiles", t => t.CreateUserId)
                .Index(t => t.CreateUserId);
            
            CreateTable(
                "dbo.Servings",
                c => new
                    {
                        ServingId = c.Long(nullable: false, identity: true),
                        Description = c.String(nullable: false, maxLength: 255),
                        FSServingId = c.Long(nullable: false),
                        FSUrl = c.String(),
                        MetricAmount = c.Decimal(nullable: false, precision: 18, scale: 2),
                        MetricUnit = c.String(maxLength: 32),
                        UnitsNumber = c.Decimal(nullable: false, precision: 18, scale: 2),
                        MeasurementDescription = c.String(nullable: false, maxLength: 255),
                        KCal = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Carbohydrate = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Protein = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Fat = c.Decimal(nullable: false, precision: 18, scale: 2),
                        DietaryFiber = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Sugars = c.Decimal(nullable: false, precision: 18, scale: 2),
                        SaturatedFat = c.Decimal(nullable: false, precision: 18, scale: 2),
                        MonounsaturatedFat = c.Decimal(nullable: false, precision: 18, scale: 2),
                        PolyunsaturatedFat = c.Decimal(nullable: false, precision: 18, scale: 2),
                        TransFat = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Cholesterol = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Sodium = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Potassium = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Calcium = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Iron = c.Decimal(nullable: false, precision: 18, scale: 2),
                        VitaminA = c.Decimal(nullable: false, precision: 18, scale: 2),
                        VitaminC = c.Decimal(nullable: false, precision: 18, scale: 2),
                        CreationTime = c.DateTime(nullable: false),
                        CreateUserId = c.Int(nullable: false),
                        FoodId = c.Long(nullable: false),
                    })
                .PrimaryKey(t => t.ServingId)
                .ForeignKey("dbo.Foods", t => t.FoodId, cascadeDelete: true)
                .Index(t => t.FoodId);
            
            CreateTable(
                "dbo.Goals",
                c => new
                    {
                        GoalId = c.Int(nullable: false, identity: true),
                        GoalType = c.Int(nullable: false),
                        Intensity = c.Int(nullable: false),
                        StartWeight = c.Decimal(nullable: false, precision: 18, scale: 2),
                        GoalWeight = c.Decimal(nullable: false, precision: 18, scale: 2),
                        EstimatedFinishDate = c.DateTime(),
                        RDE = c.Decimal(nullable: false, precision: 18, scale: 2),
                        CreationTime = c.DateTime(nullable: false),
                        EndTime = c.DateTime(),
                        CreateUserId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.GoalId)
                .ForeignKey("dbo.UserProfiles", t => t.CreateUserId, cascadeDelete: true)
                .Index(t => t.CreateUserId);
            
            CreateTable(
                "dbo.Notifications",
                c => new
                    {
                        UserProfileId = c.Int(nullable: false),
                        PushNotifications = c.Boolean(),
                        Newsletter = c.Boolean(),
                    })
                .PrimaryKey(t => t.UserProfileId)
                .ForeignKey("dbo.UserProfiles", t => t.UserProfileId, cascadeDelete: true)
                .Index(t => t.UserProfileId);
            
            CreateTable(
                "dbo.UserWeights",
                c => new
                    {
                        UserWeightId = c.Int(nullable: false, identity: true),
                        Weight = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Date = c.DateTime(nullable: false),
                        CreateUserId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.UserWeightId)
                .ForeignKey("dbo.UserProfiles", t => t.CreateUserId, cascadeDelete: true)
                .Index(t => t.CreateUserId);
            
            CreateTable(
                "dbo.WorkoutDiaryEntries",
                c => new
                    {
                        WorkoutDiaryEntryId = c.Int(nullable: false, identity: true),
                        ExerciseId = c.Int(nullable: false),
                        DateUTC = c.DateTime(nullable: false),
                        HeartRate = c.Int(nullable: false),
                        BurnedCalories = c.Decimal(nullable: false, precision: 18, scale: 2),
                        CreationInfo_CreationTimeUTC = c.DateTime(nullable: false),
                        CreationInfo_LastModifiedTimeUTC = c.DateTime(nullable: false),
                        CreateUserId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.WorkoutDiaryEntryId)
                .ForeignKey("dbo.UserProfiles", t => t.CreateUserId)
                .ForeignKey("dbo.Exercises", t => t.ExerciseId, cascadeDelete: true)
                .Index(t => t.ExerciseId)
                .Index(t => t.CreateUserId);
            
            CreateTable(
                "dbo.Exercises",
                c => new
                    {
                        ExerciseId = c.Int(nullable: false, identity: true),
                        Title = c.String(nullable: false),
                        Description = c.String(nullable: false),
                        ImageUrl = c.String(),
                        VideoUrl = c.String(),
                        Type = c.Int(nullable: false),
                        Complexity = c.Int(nullable: false),
                        Mechanics = c.Int(nullable: false),
                        CanBeDoneAtHome = c.Boolean(nullable: false),
                        MET = c.Decimal(precision: 18, scale: 2),
                        CreationInfo_CreationTimeUTC = c.DateTime(nullable: false),
                        CreationInfo_LastModifiedTimeUTC = c.DateTime(nullable: false),
                        CreateUserId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.ExerciseId)
                .ForeignKey("dbo.UserProfiles", t => t.CreateUserId, cascadeDelete: true)
                .Index(t => t.CreateUserId);
            
            CreateTable(
                "dbo.ExerciseEquipments",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Title = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.ExerciseMuscles",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Title = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.ExerciseSteps",
                c => new
                    {
                        ExerciseStepId = c.Int(nullable: false, identity: true),
                        Title = c.String(),
                        Description = c.String(nullable: false),
                        Order = c.Int(nullable: false),
                        ImageUrl = c.String(),
                        ExerciseId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.ExerciseStepId)
                .ForeignKey("dbo.Exercises", t => t.ExerciseId, cascadeDelete: true)
                .Index(t => t.ExerciseId);
            
            CreateTable(
                "dbo.WorkoutSets",
                c => new
                    {
                        WorkoutSetId = c.Int(nullable: false, identity: true),
                        Order = c.Int(nullable: false),
                        Reps = c.Int(nullable: false),
                        Weight = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Rest = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Duration = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Distance = c.Decimal(nullable: false, precision: 18, scale: 2),
                        IsCompleted = c.Boolean(nullable: false),
                        WorkoutDiaryEntryId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.WorkoutSetId)
                .ForeignKey("dbo.WorkoutDiaryEntries", t => t.WorkoutDiaryEntryId, cascadeDelete: true)
                .Index(t => t.WorkoutDiaryEntryId);
            
            CreateTable(
                "dbo.Logs",
                c => new
                    {
                        LogId = c.Int(nullable: false, identity: true),
                        CreationTime = c.DateTime(nullable: false),
                        Message = c.String(),
                        CreateUserId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.LogId)
                .ForeignKey("dbo.UserProfiles", t => t.CreateUserId, cascadeDelete: true)
                .Index(t => t.CreateUserId);
            
            CreateTable(
                "dbo.AspNetRoles",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.Name, unique: true, name: "RoleNameIndex");
            
            CreateTable(
                "dbo.ExerciseEquipmentExercises",
                c => new
                    {
                        ExerciseEquipment_Id = c.Int(nullable: false),
                        Exercise_ExerciseId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.ExerciseEquipment_Id, t.Exercise_ExerciseId })
                .ForeignKey("dbo.ExerciseEquipments", t => t.ExerciseEquipment_Id, cascadeDelete: true)
                .ForeignKey("dbo.Exercises", t => t.Exercise_ExerciseId, cascadeDelete: true)
                .Index(t => t.ExerciseEquipment_Id)
                .Index(t => t.Exercise_ExerciseId);
            
            CreateTable(
                "dbo.ExerciseMainMuscles",
                c => new
                    {
                        ExerciseId = c.Int(nullable: false),
                        Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.ExerciseId, t.Id })
                .ForeignKey("dbo.Exercises", t => t.ExerciseId, cascadeDelete: true)
                .ForeignKey("dbo.ExerciseMuscles", t => t.Id, cascadeDelete: true)
                .Index(t => t.ExerciseId)
                .Index(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AspNetUserRoles", "RoleId", "dbo.AspNetRoles");
            DropForeignKey("dbo.Logs", "CreateUserId", "dbo.UserProfiles");
            DropForeignKey("dbo.WorkoutSets", "WorkoutDiaryEntryId", "dbo.WorkoutDiaryEntries");
            DropForeignKey("dbo.WorkoutDiaryEntries", "ExerciseId", "dbo.Exercises");
            DropForeignKey("dbo.ExerciseSteps", "ExerciseId", "dbo.Exercises");
            DropForeignKey("dbo.ExerciseMainMuscles", "Id", "dbo.ExerciseMuscles");
            DropForeignKey("dbo.ExerciseMainMuscles", "ExerciseId", "dbo.Exercises");
            DropForeignKey("dbo.ExerciseEquipmentExercises", "Exercise_ExerciseId", "dbo.Exercises");
            DropForeignKey("dbo.ExerciseEquipmentExercises", "ExerciseEquipment_Id", "dbo.ExerciseEquipments");
            DropForeignKey("dbo.Exercises", "CreateUserId", "dbo.UserProfiles");
            DropForeignKey("dbo.WorkoutDiaryEntries", "CreateUserId", "dbo.UserProfiles");
            DropForeignKey("dbo.UserWeights", "CreateUserId", "dbo.UserProfiles");
            DropForeignKey("dbo.Notifications", "UserProfileId", "dbo.UserProfiles");
            DropForeignKey("dbo.Goals", "CreateUserId", "dbo.UserProfiles");
            DropForeignKey("dbo.FoodDiaryEntries", "FoodId", "dbo.Foods");
            DropForeignKey("dbo.Servings", "FoodId", "dbo.Foods");
            DropForeignKey("dbo.Foods", "CreateUserId", "dbo.UserProfiles");
            DropForeignKey("dbo.FoodDiaryEntries", "CreateUserId", "dbo.UserProfiles");
            DropForeignKey("dbo.BodyParameters", "CreateUserId", "dbo.UserProfiles");
            DropForeignKey("dbo.UserProfiles", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserClaims", "UserId", "dbo.AspNetUsers");
            DropIndex("dbo.ExerciseMainMuscles", new[] { "Id" });
            DropIndex("dbo.ExerciseMainMuscles", new[] { "ExerciseId" });
            DropIndex("dbo.ExerciseEquipmentExercises", new[] { "Exercise_ExerciseId" });
            DropIndex("dbo.ExerciseEquipmentExercises", new[] { "ExerciseEquipment_Id" });
            DropIndex("dbo.AspNetRoles", "RoleNameIndex");
            DropIndex("dbo.Logs", new[] { "CreateUserId" });
            DropIndex("dbo.WorkoutSets", new[] { "WorkoutDiaryEntryId" });
            DropIndex("dbo.ExerciseSteps", new[] { "ExerciseId" });
            DropIndex("dbo.Exercises", new[] { "CreateUserId" });
            DropIndex("dbo.WorkoutDiaryEntries", new[] { "CreateUserId" });
            DropIndex("dbo.WorkoutDiaryEntries", new[] { "ExerciseId" });
            DropIndex("dbo.UserWeights", new[] { "CreateUserId" });
            DropIndex("dbo.Notifications", new[] { "UserProfileId" });
            DropIndex("dbo.Goals", new[] { "CreateUserId" });
            DropIndex("dbo.Servings", new[] { "FoodId" });
            DropIndex("dbo.Foods", new[] { "CreateUserId" });
            DropIndex("dbo.FoodDiaryEntries", new[] { "CreateUserId" });
            DropIndex("dbo.FoodDiaryEntries", new[] { "FoodId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "RoleId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "UserId" });
            DropIndex("dbo.AspNetUserLogins", new[] { "UserId" });
            DropIndex("dbo.AspNetUserClaims", new[] { "UserId" });
            DropIndex("dbo.AspNetUsers", "UserNameIndex");
            DropIndex("dbo.UserProfiles", new[] { "UserId" });
            DropIndex("dbo.BodyParameters", new[] { "CreateUserId" });
            DropTable("dbo.ExerciseMainMuscles");
            DropTable("dbo.ExerciseEquipmentExercises");
            DropTable("dbo.AspNetRoles");
            DropTable("dbo.Logs");
            DropTable("dbo.WorkoutSets");
            DropTable("dbo.ExerciseSteps");
            DropTable("dbo.ExerciseMuscles");
            DropTable("dbo.ExerciseEquipments");
            DropTable("dbo.Exercises");
            DropTable("dbo.WorkoutDiaryEntries");
            DropTable("dbo.UserWeights");
            DropTable("dbo.Notifications");
            DropTable("dbo.Goals");
            DropTable("dbo.Servings");
            DropTable("dbo.Foods");
            DropTable("dbo.FoodDiaryEntries");
            DropTable("dbo.AspNetUserRoles");
            DropTable("dbo.AspNetUserLogins");
            DropTable("dbo.AspNetUserClaims");
            DropTable("dbo.AspNetUsers");
            DropTable("dbo.UserProfiles");
            DropTable("dbo.BodyParameters");
        }
    }
}
