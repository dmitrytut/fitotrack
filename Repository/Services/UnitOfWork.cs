using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using fitotrack.Data;
using fitotrack.Entity.Models;
using fitotrack.Repository.Generic;
using fitotrack.Repository.Auth;

namespace fitotrack.Repository.Services
{
    public class UnitOfWork : IDisposable
    {
        #region __Поля__

        private bool disposed = false;
        private FitotrackContext context = new FitotrackContext();

        //Репозитории
        private GenericRepo<UserProfile> userProfileRepository;
        private GenericRepo<Food> foodRepository;
        private GenericRepo<FoodDiaryEntry> foodDiaryEntryRepository;
        private GenericRepo<Exercise> exerciseRepository;
        private GenericRepo<WorkoutDiaryEntry> workoutDiaryEntryRepository;
        private GenericRepo<WorkoutSet> workoutSetRepository;
        private GenericRepo<UserWeight> userWeightRepository;
        private GenericRepo<Goal> goalRepository;
        private GenericRepo<Notifications> notificationsRepository;
        #endregion

        #region __Свойства__
        public GenericRepo<WorkoutSet> WorkoutSetRepository
        {
            get
            {
                if (this.workoutSetRepository == null)
                {
                    this.workoutSetRepository = new GenericRepo<WorkoutSet>(context);
                }
                return workoutSetRepository;
            }
        }
        public GenericRepo<WorkoutDiaryEntry> WorkoutDiaryEntryRepository
        {
            get
            {
                if (this.workoutDiaryEntryRepository == null)
                {
                    this.workoutDiaryEntryRepository = new GenericRepo<WorkoutDiaryEntry>(context);
                }
                return workoutDiaryEntryRepository;
            }
        }
        public GenericRepo<Exercise> ExerciseRepository
        {
            get
            {
                if (this.exerciseRepository == null)
                {
                    this.exerciseRepository = new GenericRepo<Exercise>(context);
                }
                return exerciseRepository;
            }
        }
        public GenericRepo<Notifications> NotificationsRepository
        {
            get
            {
                if (this.notificationsRepository == null)
                {
                    this.notificationsRepository = new GenericRepo<Notifications>(context);
                }
                return notificationsRepository;
            }
        }
        public GenericRepo<Goal> GoalRepository
        {
            get
            {
                if (this.goalRepository == null)
                {
                    this.goalRepository = new GenericRepo<Goal>(context);
                }
                return goalRepository;
            }
        }
        public GenericRepo<UserWeight> UserWeightRepository
        {
            get
            {
                if (this.userWeightRepository == null)
                {
                    this.userWeightRepository = new GenericRepo<UserWeight>(context);
                }
                return userWeightRepository;
            }
        }
        public GenericRepo<UserProfile> UserProfileRepository
        {
            get
            {
                if (this.userProfileRepository == null)
                {
                    this.userProfileRepository = new GenericRepo<UserProfile>(context);
                }
                return userProfileRepository;
            }
        }
        public GenericRepo<Food> FoodRepository
        {
            get
            {
                if (this.foodRepository == null)
                {
                    this.foodRepository = new GenericRepo<Food>(context);
                }
                return foodRepository;
            }
        }
        public GenericRepo<FoodDiaryEntry> FoodDiaryEntryRepository
        {
            get
            {
                if (this.foodDiaryEntryRepository == null)
                {
                    this.foodDiaryEntryRepository = new GenericRepo<FoodDiaryEntry>(context);
                }
                return foodDiaryEntryRepository;
            }
        }
        #endregion

        #region __Методы__

        public void Save()
        {
            context.SaveChanges();
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        #endregion
    }
}
