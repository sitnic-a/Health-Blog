﻿// <auto-generated />
using MentalHealthBlogAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace MentalHealthBlogAPI.Migrations
{
    [DbContext(typeof(DataContext))]
    partial class DataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.12")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("MentalHealthBlog.API.Models.Tag", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Tags");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Name = "Ljubav"
                        },
                        new
                        {
                            Id = 2,
                            Name = "Porodica"
                        },
                        new
                        {
                            Id = 3,
                            Name = "Posao"
                        },
                        new
                        {
                            Id = 4,
                            Name = "Zdravlje"
                        },
                        new
                        {
                            Id = 5,
                            Name = "Prijatelji"
                        },
                        new
                        {
                            Id = 6,
                            Name = "Karijera"
                        },
                        new
                        {
                            Id = 7,
                            Name = "Novac"
                        });
                });

            modelBuilder.Entity("MentalHealthBlogAPI.Models.Post", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Posts");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Content = "Content_T01",
                            Title = "Title_01",
                            UserId = 1
                        },
                        new
                        {
                            Id = 2,
                            Content = "Content_T02",
                            Title = "Title_02",
                            UserId = 1
                        },
                        new
                        {
                            Id = 3,
                            Content = "Content_T03",
                            Title = "Title_03",
                            UserId = 2
                        },
                        new
                        {
                            Id = 4,
                            Content = "Content_T04",
                            Title = "Title_04",
                            UserId = 2
                        },
                        new
                        {
                            Id = 5,
                            Content = "Content_T05",
                            Title = "Title_05",
                            UserId = 1
                        });
                });

            modelBuilder.Entity("MentalHealthBlogAPI.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<byte[]>("PasswordSalt")
                        .IsRequired()
                        .HasColumnType("varbinary(max)");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Users");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            PasswordHash = "TT1",
                            PasswordSalt = new byte[] { 83, 101, 116, 66, 121, 116, 101, 115, 95, 84, 84, 49 },
                            Username = "test_01"
                        },
                        new
                        {
                            Id = 2,
                            PasswordHash = "TT2",
                            PasswordSalt = new byte[] { 83, 101, 116, 66, 121, 116, 101, 115, 95, 84, 84, 50 },
                            Username = "test_02"
                        },
                        new
                        {
                            Id = 3,
                            PasswordHash = "TT3",
                            PasswordSalt = new byte[] { 83, 101, 116, 66, 121, 116, 101, 115, 95, 84, 84, 51 },
                            Username = "test_03"
                        },
                        new
                        {
                            Id = 4,
                            PasswordHash = "TT4",
                            PasswordSalt = new byte[] { 83, 101, 116, 66, 121, 116, 101, 115, 95, 84, 84, 52 },
                            Username = "test_04"
                        });
                });

            modelBuilder.Entity("MentalHealthBlogAPI.Models.Post", b =>
                {
                    b.HasOne("MentalHealthBlogAPI.Models.User", "User")
                        .WithMany("Posts")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("MentalHealthBlogAPI.Models.User", b =>
                {
                    b.Navigation("Posts");
                });
#pragma warning restore 612, 618
        }
    }
}
