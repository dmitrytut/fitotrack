using fitotrack.Entity.Models;
using System;
using System.Data.Entity.Migrations;
using System.Linq;
using fitotrack.Entity.Enums;
using WebMatrix.WebData;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Collections.Generic;

namespace fitotrack.Data.Migrations
{
    internal sealed class Configuration : DbMigrationsConfiguration<FitotrackContext>
    {
        private readonly bool _pendingMigrations;

        public Configuration()
        {
            AutomaticMigrationsEnabled = false;

            var migrator = new DbMigrator(this);
            _pendingMigrations = migrator.GetPendingMigrations().Any();
        }

        protected override void Seed(FitotrackContext context)
        {
            base.Seed(context);

            #region __SQL Queries__

            #region _Triggers_

            #region __ExerciseMusclesDelete__
            //// Проверяем есть ли триггер удаления с именем 'DeleteExerciseMusclesCascadeTrig'.
            //// Если есть - удаляем его.
            //context.Database.ExecuteSqlCommand("IF EXISTS " +
            //                                    "(SELECT * FROM sys.objects " +
            //                                    "WHERE [type] = 'TR' " +
            //                                        "AND [name] = 'DeleteExerciseMusclesCascadeTrig') " +
            //                                    "DROP TRIGGER DeleteExerciseMusclesCascadeTrig;");

            //// Создаем триггер удаления 'DeleteExerciseMusclesCascadeTrig', 
            //// который будет удалять все ExerciseMuscles записи, связанные с Exercise.
            //context.Database.ExecuteSqlCommand("CREATE TRIGGER DeleteExerciseMusclesCascadeTrig " +
            //                                        "ON [dbo].[Exercises] " +
            //                                        "FOR DELETE " +
            //                                    "AS " +
            //                                        "DELETE [dbo].[ExerciseMuscles] " +
            //                                        "FROM [dbo].[ExerciseMuscles], deleted " +
            //                                        "WHERE [dbo].[ExerciseMuscles].[ExerciseMusclesId] = deleted.MainMusclesId " +
            //                                            "OR [dbo].[ExerciseMuscles].[ExerciseMusclesId] = deleted.OtherMusclesId");
            #endregion

            #region __FoodDiaryEntriesDelete__
            //// Проверяем есть ли триггер удаления с именем 'DeleteFoodDiaryEntriesCascadeTrig'.
            //// Если есть - удаляем его.
            //context.Database.ExecuteSqlCommand("IF EXISTS " +
            //                                    "(SELECT * FROM sys.objects " +
            //                                    "WHERE [type] = 'TR' " +
            //                                        "AND [name] = 'DeleteFoodDiaryEntriesCascadeTrig') " +
            //                                    "DROP TRIGGER DeleteFoodDiaryEntriesCascadeTrig;");
            //// Создаем триггер удаления 'DeleteFoodDiaryEntriesCascadeTrig', 
            //// который будет удалять все FoodDiaryEntry записи, связанные с UserProfile.
            //context.Database.ExecuteSqlCommand("CREATE TRIGGER DeleteFoodDiaryEntriesCascadeTrig " +
            //                                        "ON [dbo].[UserProfiles] " +
            //                                        "FOR DELETE " +
            //                                    "AS " +
            //                                        "DELETE [dbo].[FoodDiaryEntries] " +
            //                                        "FROM [dbo].[FoodDiaryEntries], deleted " +
            //                                        "WHERE [dbo].[FoodDiaryEntries].[CreateUserId] = deleted.UserId ");
            #endregion

            #region __WorkoutDiaryEntriesDelete__
            //// Проверяем есть ли триггер удаления с именем 'DeleteWorkoutDiaryEntriesCascadeTrig'.
            //// Если есть - удаляем его.
            //context.Database.ExecuteSqlCommand("IF EXISTS " +
            //                                    "(SELECT * FROM sys.objects " +
            //                                    "WHERE [type] = 'TR' " +
            //                                        "AND [name] = 'DeleteWorkoutDiaryEntriesCascadeTrig') " +
            //                                    "DROP TRIGGER DeleteWorkoutDiaryEntriesCascadeTrig;");
            //// Создаем триггер удаления 'DeleteWorkoutDiaryEntriesCascadeTrig', 
            //// который будет удалять все WorkoutDiaryEntry записи, связанные с UserProfile.
            //context.Database.ExecuteSqlCommand("CREATE TRIGGER DeleteWorkoutDiaryEntriesCascadeTrig " +
            //                                        "ON [dbo].[UserProfiles] " +
            //                                        "FOR DELETE " +
            //                                    "AS " +
            //                                        "DELETE [dbo].[WorkoutDiaryEntries] " +
            //                                        "FROM [dbo].[WorkoutDiaryEntries], deleted " +
            //                                        "WHERE [dbo].[WorkoutDiaryEntries].[CreateUserId] = deleted.UserId ");
            #endregion
            #endregion

            #endregion

#if DEBUG
            //if (System.Diagnostics.Debugger.IsAttached == false)
            //    System.Diagnostics.Debugger.Launch();

            #region __Заполняем пользователей__

            var UserManager = new UserManager<ApplicationUser, int>(new CustomUserStore(context));
            var user = new ApplicationUser();
            user.UserName = "dmitry.tut@gmail.com";
            user.Email = "dmitry.tut@gmail.com";
            string password = "123123";
            user.UserProfile = new UserProfile
            {
                FullName = "Dmitry Tut",
                DateOfBirth = new DateTime(1988, 5, 14),
                Gender = 1,
                Height = 184,
                ActivityLevel = 3,
                Location = "Moscow",
                Weights = {
                    new UserWeight { Date = DateTime.Now, Weight = 80 }
                }
            };
            var duplicate = UserManager.FindByEmail(user.Email);
            if (duplicate != null)
            {
                UserManager.Delete(duplicate);
            }
            var result = UserManager.Create(user, password);
            if (!result.Succeeded)
            {
                throw new Exception(result.Errors.ElementAt(0));
            }
            user = UserManager.FindByEmail(user.Email);
            if (user == null)
            {
                throw new Exception("User object is null.");
            }
            //user = UserManager.FindById(user);
            //context.UserProfiles.AddOrUpdate(userProfile);
            #endregion

            #region __Заполняем упражнения__
            ExerciseStep[] steps = { 
                                       new ExerciseStep { 
                                           Description="Step1 description",
                                           Order = 0
                                       },
                                       new ExerciseStep{ 
                                           Description="Step2 description",
                                           Order = 1 
                                       }
                                   };

            var muscles = new List<ExerciseMuscles> {
                new ExerciseMuscles {
                    Title = "Back"
                },
                new ExerciseMuscles {
                    Title = "Shoulders"
                }
            };

            context.Muscles.AddOrUpdate(muscles[0]);
            context.Muscles.AddOrUpdate(muscles[1]);

            var exercise = new Exercise
            {
                Title = "Exercise 1",
                Description = "Exercise Description 1",
                Steps = steps.ToList(),
                MainMuscles = muscles,
                //OtherMuscles = new List<ExerciseMuscles>{
                //    new ExerciseMuscles {
                //        Title = "Abs"
                //    },
                //    new ExerciseMuscles {
                //        Title = "Calves"
                //    }
                //},
                Type = (int)ExerciseTypes.Strength,
                Complexity = (int)ExerciseComplexity.BeginningLevel,
                Mechanics = (int)ExerciseMechanics.Compound,
                Equipment = new List<ExerciseEquipment>{
                    new ExerciseEquipment{
                        Title = "Bench"
                    },
                    new ExerciseEquipment{
                        Title = "Ball"
                    }
                },
                CanBeDoneAtHome = false,
                MET = 2.3M,
                CreationInfo = new CreationInfo{ 
                    CreationTimeUTC = DateTime.UtcNow,
                    LastModifiedTimeUTC = DateTime.UtcNow },
                CreateUserId = user.Id,
                CreateUser = user.UserProfile
            };

            context.Exercises.AddOrUpdate(exercise);


            // Running
            steps = new ExerciseStep[] { 
                                new ExerciseStep { 
                                    Description="Wear running shoes.",
                                    Order = 0
                                },
                                new ExerciseStep{ 
                                    Description="Go running!",
                                    Order = 1 
                                }
                            };

            muscles = new List<ExerciseMuscles> {
                new ExerciseMuscles {
                    Title = "Legs"
                }
            };

            context.Muscles.AddOrUpdate(muscles[0]);

            exercise = new Exercise
            {
                Title = "Running",
                Description = "Running is an excelent exercise!",
                Steps = steps.ToList(),
                MainMuscles = muscles,
                Type = (int)ExerciseTypes.Cardio,
                Complexity = (int)ExerciseComplexity.BeginningLevel,
                Mechanics = (int)ExerciseMechanics.Compound,
                //Equipment = new List<ExerciseEquipment>{},
                CanBeDoneAtHome = false,
                MET = 8,
                CreationInfo = new CreationInfo
                {
                    CreationTimeUTC = DateTime.UtcNow,
                    LastModifiedTimeUTC = DateTime.UtcNow
                },
                CreateUserId = user.Id,
                CreateUser = user.UserProfile
            };

            context.Exercises.AddOrUpdate(exercise);
            #endregion

            #region __Заполняем дневник упражнений__
            var workoutDiaryEntry = new WorkoutDiaryEntry
            {
                DateUTC = DateTime.UtcNow,
                ExerciseId = exercise.ExerciseId,
                Exercise = exercise,
                Sets = new List<WorkoutSet>
                {
                    new WorkoutSet{
                        Order = 0,
                        Reps = 2,
                        Weight = 33,
                        IsCompleted = false
                    },
                    new WorkoutSet{
                        Order = 1,
                        Reps = 4,
                        Weight = 44,
                        IsCompleted = false
                    }
                },
                CreationInfo = new CreationInfo
                {
                    CreationTimeUTC = DateTime.UtcNow,
                    LastModifiedTimeUTC = DateTime.UtcNow
                },
                CreateUserId = user.Id,
                CreateUser = user.UserProfile
            };

            context.WorkoutDiaryEntries.AddOrUpdate(workoutDiaryEntry);
            #endregion

            context.SaveChanges();
#endif
        }
    }
}
