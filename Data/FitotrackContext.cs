using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using fitotrack.Entity.Models;

namespace fitotrack.Data
{
    #region __Класс UsersContext контекст базы данных приложения__

    public class FitotrackContext : ApplicationDbContext
    {
        public FitotrackContext()
        {
            Database.SetInitializer<FitotrackContext>(null);

            this.Configuration.LazyLoadingEnabled = false;
            this.Configuration.ProxyCreationEnabled = false;
        }

        #region __Свойства__
        public DbSet<Food> Foods { get; set; }
        public DbSet<Serving> Servings { get; set; }
        public DbSet<FoodDiaryEntry> FoodDiaryEntries { get; set; }
        public DbSet<Exercise> Exercises { get; set; }
        public DbSet<ExerciseStep> ExerciseSteps { get; set; }
        public DbSet<ExerciseMuscles> Muscles { get; set; }
        public DbSet<ExerciseEquipment> Equipment { get; set; }
        public DbSet<WorkoutDiaryEntry> WorkoutDiaryEntries { get; set; }
        public DbSet<WorkoutSet> WorkoutSets { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<BodyParameters> BodyParameters { get; set; }
        public DbSet<Log> Logs { get; set; }
        #endregion

        #region __Методы__
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            #region __Fluent Api relationships__

            #region __Food <-> UserProfile__
            // Выключаем каскадное удаление Food при удалении UserProfile.
            //modelBuilder.Entity<Food>()
            //    .HasRequired(i => i.CreateUser)
            //    .WithMany()
            //    .HasForeignKey(i => i.CreateUserId)
            //    .WillCascadeOnDelete(false);
            //modelBuilder.Entity<Food>().HasRequired(c => c.CreateUser).WithMany().WillCascadeOnDelete(false);
            #endregion

            #region __UserProfile <-> Notifications__
            // Включаем каскадное удаление Notifications при удалении UserProfile.
            modelBuilder.Entity<UserProfile>()
                .HasOptional(x => x.Notifications)
                .WithRequired(x => x.UserProfile)
                .WillCascadeOnDelete(true);
            #endregion

            #region __FoodDiaryEntry <-> UserProfile__
            // Связь one-to-many между UserProfile и FoodDiaryEntry с выключенным каскадным удалением.
            modelBuilder.Entity<FoodDiaryEntry>()
                .HasRequired(i => i.CreateUser)
                .WithMany(i => i.FoodDiaryEntries)
                .HasForeignKey(i => i.CreateUserId)
                .WillCascadeOnDelete(false);
            #endregion

            #region __WorkoutDiaryEntry <-> UserProfile__
            // Связь one-to-many между UserProfile и WorkoutDiaryEntry с выключенным каскадным удалением.
            modelBuilder.Entity<WorkoutDiaryEntry>()
                .HasRequired(i => i.CreateUser)
                .WithMany(i => i.WorkoutDiaryEntries)
                .HasForeignKey(i => i.CreateUserId)
                .WillCascadeOnDelete(false);
            #endregion

            #region __Exercise <-> Muscles__

            modelBuilder.Entity<Exercise>()
                .HasMany(u => u.MainMuscles)
                .WithMany(t => t.Exercises)
                .Map(x =>
                {
                    x.MapLeftKey("ExerciseId");
                    x.MapRightKey("Id");
                    x.ToTable("ExerciseMainMuscles");
                });

            #endregion

            #endregion
        }
        #endregion
    }
    #endregion
}