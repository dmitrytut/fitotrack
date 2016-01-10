using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using fitotrack.Models.Converters;
using fitotrack.Entity.Models;
using fitotrack.Models.Meal;
using fitotrack.Models.Meal.DTO;
using fitotrack.Models.Profile.DTO;
using System.Linq.Expressions;
using fitotrack.Models.Workout.DTO;
using fitotrack.Models.Common.DTO;

namespace fitotrack.Models
{
    public class ModelMapper
    {
        public static void Create()
        {
            #region __Common__
            Mapper.CreateMap<CreationInfo, CreationInfoDTO>()
                // DateTime (SRC) -> msUnixTimestamp (DTO)
                .ForMember(dest => dest.CreationTime,
                        opt => opt.ResolveUsing<DateTimeToUnixResolver>()
                            .FromMember(src => src.CreationTimeUTC))
                .ForMember(dest => dest.LastModifiedTime,
                        opt => opt.ResolveUsing<DateTimeToUnixResolver>()
                            .FromMember(src => src.LastModifiedTimeUTC));
            Mapper.CreateMap<CreationInfoDTO, CreationInfo>()
                // msUnixTimestamp (DTO) -> DateTime (SRC)
                .ForMember(dest => dest.CreationTimeUTC,
                        opt => opt.ResolveUsing<UnixToDateTimeResolver>()
                            .FromMember(src => src.CreationTime))
                .ForMember(dest => dest.LastModifiedTimeUTC,
                        opt => opt.ResolveUsing<UnixToDateTimeResolver>()
                            .FromMember(src => src.LastModifiedTime));
            #endregion

            #region __Serving__
            TwoWayMapping<Serving, ServingDTO>();

            // CreationTime Property
            //
            // msUnixTimestamp (DTO) -> DateTime (SRC)
            Mapper.CreateMap<ServingDTO, Serving>().
              ForMember(dest => dest.CreationTime,
                        opt => opt.ResolveUsing<UnixToDateTimeResolver>().
                          FromMember(src => src.CreationTime));

            // DateTime (SRC) -> msUnixTimestamp (DTO)
            Mapper.CreateMap<Serving, ServingDTO>().
              ForMember(dest => dest.CreationTime,
                        opt => opt.ResolveUsing<DateTimeToUnixResolver>().
                          FromMember(src => src.CreationTime));
            #endregion

            #region __Food__
            Mapper.CreateMap<Food, FoodDTO>().
              ForMember(dest => dest.Servings,
                        opt => opt.MapFrom(src => new FoodDTO.ServingList { Serving = Mapper.Map<List<ServingDTO>>(src.Servings).ToList() }));
            Mapper.CreateMap<FoodDTO, Food>().
              ForMember(dest => dest.Servings,
                        opt => opt.MapFrom(src => src.Servings.Serving));

            // CreationTime Property
            //
            // msUnixTimestamp (DTO) -> DateTime (SRC)
            Mapper.CreateMap<FoodDTO, Food>().
              ForMember(dest => dest.CreationTime,
                        opt => opt.ResolveUsing<UnixToDateTimeResolver>().
                          FromMember(src => src.CreationTime));

            // DateTime (SRC) -> msUnixTimestamp (DTO)
            Mapper.CreateMap<Food, FoodDTO>().
              ForMember(dest => dest.CreationTime,
                        opt => opt.ResolveUsing<DateTimeToUnixResolver>().
                          FromMember(src => src.CreationTime));
            #endregion

            #region __Food Diary__
            Mapper.CreateMap<FoodDiaryEntryDTO, FoodDiaryEntry>().
              ForMember(dest => dest.Food,
                        opt => opt.MapFrom(src => src.FoodDTO));
            Mapper.CreateMap<FoodDiaryEntry, FoodDiaryEntryDTO>().
              ForMember(dest => dest.FoodDTO,
                        opt => opt.MapFrom(src => src.Food));


            // CreationTime Property
            //
            // msUnixTimestamp (DTO) -> DateTime (SRC)
            Mapper.CreateMap<FoodDiaryEntryDTO, FoodDiaryEntry>().
              ForMember(dest => dest.CreationTime,
                        opt => opt.ResolveUsing<UnixToDateTimeResolver>().
                          FromMember(src => src.CreationTime));

            // DateTime (SRC) -> msUnixTimestamp (DTO)
            Mapper.CreateMap<FoodDiaryEntry, FoodDiaryEntryDTO>().
              ForMember(dest => dest.CreationTime,
                        opt => opt.ResolveUsing<DateTimeToUnixResolver>().
                          FromMember(src => src.CreationTime));

            // Date Property
            //
            // msUnixTimestamp (DTO) -> DateTime (SRC)
            Mapper.CreateMap<FoodDiaryEntryDTO, FoodDiaryEntry>().
              ForMember(dest => dest.Date,
                        opt => opt.ResolveUsing<UnixToDateTimeResolver>().
                          FromMember(src => src.Date));

            // DateTime (SRC) -> msUnixTimestamp (DTO)
            Mapper.CreateMap<FoodDiaryEntry, FoodDiaryEntryDTO>().
              ForMember(dest => dest.Date,
                        opt => opt.ResolveUsing<DateTimeToUnixResolver>().
                          FromMember(src => src.Date));

            TwoWayMapping<FoodDiaryEntry, FoodDiaryEntryUpdateDTO>();
            #endregion

            #region __Exercises__
            ModelMapper.TwoWayMapping<Exercise, ExerciseDTO>();
            ModelMapper.TwoWayMapping<ExerciseMuscles, ExerciseMusclesDTO>();
            ModelMapper.TwoWayMapping<ExerciseStep, ExerciseStepDTO>();
            ModelMapper.TwoWayMapping<ExerciseEquipment, ExerciseEquipmentDTO>();
            #endregion

            #region __Workout Diary__
            Mapper.CreateMap<WorkoutDiaryEntry, WorkoutDiaryEntryDTO>()
                // DateTime (SRC) -> msUnixTimestamp (DTO)
                .ForMember(dest => dest.Date,
                        opt => opt.ResolveUsing<DateTimeToUnixResolver>()
                            .FromMember(src => src.DateUTC));
            Mapper.CreateMap<WorkoutDiaryEntryDTO, WorkoutDiaryEntry>()
                // msUnixTimestamp (DTO) -> DateTime (SRC)
                .ForMember(dest => dest.DateUTC,
                        opt => opt.ResolveUsing<UnixToDateTimeResolver>()
                            .FromMember(src => src.Date));
                //.ForMember(dest => dest.BurnedCalories,
                //       opt => opt.ResolveUsing<BurnedCaloriesResolver>()
                //            .FromMember(src => src));

            ModelMapper.TwoWayMapping<WorkoutSet, WorkoutSetDTO>();
            #endregion

            #region __User Profile__

            #region General
            //Mapper.CreateMap<ApplicationUser, GeneralDTO>()
            //    .ForAllMembers(opt => opt.Ignore());
            //Mapper.CreateMap<ApplicationUser, GeneralDTO>()
            //    .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserName));
            //Mapper.CreateMap<GeneralDTO, ApplicationUser>()
            //    .ForAllMembers(opt => opt.Ignore());
            //Mapper.CreateMap<GeneralDTO, ApplicationUser>()
            //    .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserName));

            Mapper.CreateMap<UserProfile, GeneralDTO>()
                .ForMember(dest => dest.UserName, opt => opt.Ignore())
                .ForMember(dest => dest.Birthday, opt => opt.MapFrom(src => src.DateOfBirth))
                // Настраиваем действия с полями из General
                .ForMember(dest => dest.Birthday,
                        opt => opt.ResolveUsing<DateTimeToUnixResolverNullable>()
                            .FromMember(src => src.DateOfBirth));

            Mapper.CreateMap<GeneralDTO, UserProfile>()
                .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.Birthday))
                // Игнорируем поле UserId, его менять нельзя!
                .ForMember(dest => dest.UserId, opt => opt.Ignore())
                // Настраиваем действия с полями из General
                .ForMember(dest => dest.DateOfBirth,
                        opt => opt.ResolveUsing<UnixToDateTimeResolverNullable>()
                            .FromMember(src => src.Birthday));
            #endregion

            #region Goal
            //Mapper.CreateMap<GoalDTO, Goal>()
            //    // Настраиваем действия с полями из General
            //    .ForMember(
            //        dest => dest.Newsletter,
            //        options => options.MapFrom(profile => profile.Notifications.Newsletter))
            //    // Настраиваем действия с полями из General
            //    .ForMember(dest => dest.Birthday,
            //            opt => opt.ResolveUsing<DateTimeToUnixResolverNullable>()
            //                .FromMember(src => src.DateOfBirth));
            //Mapper.CreateMap<GeneralDTO, UserProfile>()
            //    .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.Birthday))
            //    // Игнорируем поле UserId, его менять нельзя!
            //    .ForMember(dest => dest.UserId, opt => opt.Ignore())
            //    // Настраиваем действия с полями из General
            //    .ForMember(dest => dest.DateOfBirth,
            //            opt => opt.ResolveUsing<UnixToDateTimeResolverNullable>()
            //                .FromMember(src => src.Birthday));
            #endregion

            #region Physical Info 
            Mapper.CreateMap<UserProfile, PhysicalInfoDTO>();
            Mapper.CreateMap<PhysicalInfoDTO, UserProfile>()
                .ForMember(dest => dest.Weights, opt => opt.Ignore());
            #endregion

            #region Physical Info Ex
            Mapper.CreateMap<UserProfile, PhysicalInfoExDTO>()
                .ForMember(dest => dest.Birthday,
                        opt => opt.ResolveUsing<DateTimeToUnixResolverNullable>()
                            .FromMember(src => src.DateOfBirth))
                .ForMember(dest => dest.Weight, opt => opt.Ignore());
            Mapper.CreateMap<PhysicalInfoExDTO, UserProfile>()
                .ForMember(dest => dest.DateOfBirth,
                        opt => opt.ResolveUsing<UnixToDateTimeResolver>()
                            .FromMember(src => src.Birthday))
                .ForMember(dest => dest.Weights, opt => opt.Ignore());
            #endregion

            #region Credentials
            Mapper.CreateMap<UserProfile, CredentialsDTO>();
            Mapper.CreateMap<CredentialsDTO, UserProfile>();
            #endregion

            #region Notifications
            Mapper.CreateMap<UserProfile, NotificationsDTO>()
                .ForMember(
                    dest => dest.Newsletter,
                    options => options.MapFrom(profile => profile.Notifications.Newsletter))
                .ForMember(
                    dest => dest.PushNotifications,
                    options => options.MapFrom(profile => profile.Notifications.PushNotifications));
            Mapper.CreateMap<NotificationsDTO, UserProfile>()
                .ForMember(dest => dest.Notifications, opt => opt.Ignore()); ;
            #endregion

            #region Privacy
            Mapper.CreateMap<UserProfile, PrivacyDTO>();
            Mapper.CreateMap<PrivacyDTO, UserProfile>();
            #endregion

            #region UserInfo
            Mapper.CreateMap<UserProfile, UserInfoDTO>()
                .ForMember(dest => dest.Birthday, opt => opt.MapFrom(src => src.DateOfBirth))
                .ForMember(dest => dest.Birthday,
                        opt => opt.ResolveUsing<DateTimeToUnixResolverNullable>()
                            .FromMember(src => src.DateOfBirth))
                .ForMember(dest => dest.Weight, opt => opt.Ignore());
                

            Mapper.CreateMap<UserInfoDTO, UserProfile>()
                .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.Birthday))
                // Игнорируем поле UserId, его менять нельзя!
                .ForMember(dest => dest.UserId, opt => opt.Ignore())
                .ForMember(dest => dest.DateOfBirth,
                        opt => opt.ResolveUsing<UnixToDateTimeResolverNullable>()
                            .FromMember(src => src.Birthday))
                .ForMember(dest => dest.Weights, opt => opt.Ignore());
            #endregion

            #region Status
            Mapper.CreateMap<UserProfile, StatusDTO>();
            Mapper.CreateMap<StatusDTO, UserProfile>();
            #endregion


            #region Obj->DTO
            Mapper.CreateMap<UserProfile, UserProfileDTO>()
                .ForMember(dto => dto.General, 
                    options => options.MapFrom(general => Mapper.Map<UserProfile, GeneralDTO>(general)))
                .ForMember(dto => dto.PhysicalInfo,
                    options => options.MapFrom(physicalInfo => Mapper.Map<UserProfile, PhysicalInfoDTO>(physicalInfo)))
                .ForMember(dto => dto.Credentials,
                    options => options.MapFrom(credentials => Mapper.Map<UserProfile, CredentialsDTO>(credentials)))
                .ForMember(dto => dto.Notifications,
                    options => options.MapFrom(notifications => Mapper.Map<UserProfile, NotificationsDTO>(notifications)))
                .ForMember(dto => dto.Privacy,
                    options => options.MapFrom(privacy => Mapper.Map<UserProfile, PrivacyDTO>(privacy)));
            #endregion

            #region DTO->Obj
            Mapper.CreateMap<UserProfileDTO, UserProfile>()
                //
                // Маппим поля из General
                .ForMember(dest => dest.UserImagePath, opt => opt.MapFrom(src => src.General.UserImagePath))
                //.ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.General.UserName))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.General.FullName))
                .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.General.Birthday))
                .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.General.Gender))
                // Настраиваем действия с полями из General
                .ForMember(dest => dest.DateOfBirth,
                        opt => opt.ResolveUsing<UnixToDateTimeResolverNullable>()
                            .FromMember(src => src.General.Birthday))
                //
                // Маппим поля из PhysicalInfo
                .ForMember(dest => dest.Height, opt => opt.MapFrom(src => src.PhysicalInfo.Height))
                .ForMember(dest => dest.ActivityLevel, opt => opt.MapFrom(src => src.PhysicalInfo.ActivityLevel))
                // Настраиваем действия с полями из PhysicalInfo
                // Не маппим взвешивания, т.к. будем обрабатывать их вручную
                .ForMember(dest => dest.Weights, opt => opt.Ignore())
                //
                // Маппим поля из Goal
                // Настраиваем действия с полями из Goal
                // Не маппим список целей, т.к. будем обрабатывать его вручную
                .ForMember(dest => dest.Goals, opt => opt.Ignore())
                //
                // Маппим поля из Credentials
                //.ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Credentials.Email))
                //
                // Маппим поля из Notifications
                //ForMember(dest => dest., opt => opt.MapFrom(src => src.Notifications.)).
                //
                // Маппим поля из Privacy
                .ForMember(dest => dest.PrivacyFlag, opt => opt.MapFrom(src => src.Privacy.PrivacyFlag));
            #endregion

            #endregion

            #region __Notifications__
            TwoWayMapping<Notifications, NotificationsDTO>();
            #endregion

            #region __User Weight__
            Mapper.CreateMap<UserWeight, UserWeightDTO>().
              ForMember(dest => dest.Date,
                        opt => opt.ResolveUsing<DateTimeToUnixResolver>().
                          FromMember(src => src.Date));
            Mapper.CreateMap<UserWeightDTO, UserWeight>().
              ForMember(dest => dest.Date,
                        opt => opt.ResolveUsing<UnixToDateTimeResolver>().
                          FromMember(src => src.Date));
            #endregion

            #region __Goal__
            Mapper.CreateMap<Goal, GoalDTO>()
              .ForMember(dest => dest.EstimatedFinishDate,
                        opt => opt.ResolveUsing<DateTimeToUnixResolverNullable>()
                          .FromMember(src => src.EstimatedFinishDate))
              .ForMember(dest => dest.CreationTime,
                    opt => opt.ResolveUsing<DateTimeToUnixResolver>()
                      .FromMember(src => src.CreationTime))
              .ForMember(dest => dest.EndTime,
                    opt => opt.ResolveUsing<DateTimeToUnixResolverNullable>()
                      .FromMember(src => src.EndTime));

            Mapper.CreateMap<GoalDTO, Goal>()
                .ForMember(dest => dest.EstimatedFinishDate,
                        opt => opt.ResolveUsing<UnixToDateTimeResolverNullable>()
                            .FromMember(src => src.EstimatedFinishDate))
                .ForMember(dest => dest.CreationTime,
                    opt => opt.ResolveUsing<UnixToDateTimeResolver>()
                        .FromMember(src => src.CreationTime))
                .ForMember(dest => dest.EndTime,
                    opt => opt.ResolveUsing<UnixToDateTimeResolverNullable>()
                        .FromMember(src => src.EndTime))
                .ForMember(dest => dest.GoalId, opt => opt.Ignore())
                .ForMember(dest => dest.CreateUser, opt => opt.Ignore())
                .ForMember(dest => dest.CreateUserId, opt => opt.Ignore())
                .ForAllMembers(opt => opt.Condition(src => !src.IsSourceValueNull));
            #endregion

        }

        protected static void TwoWayMapping<T1, T2>()
        {
            Mapper.CreateMap<T1, T2>();
            Mapper.CreateMap<T2, T1>();
        }
    }
}