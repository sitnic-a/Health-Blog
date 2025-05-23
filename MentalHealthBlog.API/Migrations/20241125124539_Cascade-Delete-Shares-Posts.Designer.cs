﻿// <auto-generated />
using System;
using MentalHealthBlogAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace MentalHealthBlogAPI.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20241125124539_Cascade-Delete-Shares-Posts")]
    partial class CascadeDeleteSharesPosts
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.12")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("MentalHealthBlog.API.Models.PostTag", b =>
                {
                    b.Property<int>("PostId")
                        .HasColumnType("int");

                    b.Property<int>("TagId")
                        .HasColumnType("int");

                    b.HasKey("PostId", "TagId");

                    b.HasIndex("TagId");

                    b.ToTable("PostsTags");
                });

            modelBuilder.Entity("MentalHealthBlog.API.Models.Role", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Roles");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Name = "Administrator"
                        },
                        new
                        {
                            Id = 2,
                            Name = "User"
                        },
                        new
                        {
                            Id = 3,
                            Name = "Parent"
                        },
                        new
                        {
                            Id = 4,
                            Name = "Psychologist / Psychotherapist"
                        });
                });

            modelBuilder.Entity("MentalHealthBlog.API.Models.Share", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ShareGuid")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("SharedAt")
                        .HasColumnType("datetime2");

                    b.Property<int>("SharedPostId")
                        .HasColumnType("int");

                    b.Property<int>("SharedWithId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("SharedPostId");

                    b.HasIndex("SharedWithId");

                    b.ToTable("Shares");
                });

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

            modelBuilder.Entity("MentalHealthBlog.API.Models.UserRole", b =>
                {
                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.Property<int>("RoleId")
                        .HasColumnType("int");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("UserRoles");
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

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

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
                            CreatedAt = new DateTime(2024, 11, 25, 13, 45, 39, 460, DateTimeKind.Local).AddTicks(3594),
                            Title = "Title_01",
                            UserId = 1
                        },
                        new
                        {
                            Id = 2,
                            Content = "Content_T02",
                            CreatedAt = new DateTime(2024, 11, 25, 13, 45, 39, 460, DateTimeKind.Local).AddTicks(3651),
                            Title = "Title_02",
                            UserId = 1
                        },
                        new
                        {
                            Id = 3,
                            Content = "Content_T03",
                            CreatedAt = new DateTime(2024, 11, 25, 13, 45, 39, 460, DateTimeKind.Local).AddTicks(3652),
                            Title = "Title_03",
                            UserId = 2
                        },
                        new
                        {
                            Id = 4,
                            Content = "Content_T04",
                            CreatedAt = new DateTime(2024, 11, 25, 13, 45, 39, 460, DateTimeKind.Local).AddTicks(3654),
                            Title = "Title_04",
                            UserId = 2
                        },
                        new
                        {
                            Id = 5,
                            Content = "Content_T05",
                            CreatedAt = new DateTime(2024, 11, 25, 13, 45, 39, 460, DateTimeKind.Local).AddTicks(3655),
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

            modelBuilder.Entity("MentalHealthBlog.API.Models.PostTag", b =>
                {
                    b.HasOne("MentalHealthBlogAPI.Models.Post", "Post")
                        .WithMany()
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MentalHealthBlog.API.Models.Tag", "Tag")
                        .WithMany()
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Post");

                    b.Navigation("Tag");
                });

            modelBuilder.Entity("MentalHealthBlog.API.Models.Share", b =>
                {
                    b.HasOne("MentalHealthBlogAPI.Models.Post", "SharedPost")
                        .WithMany()
                        .HasForeignKey("SharedPostId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MentalHealthBlogAPI.Models.User", "SharedWith")
                        .WithMany()
                        .HasForeignKey("SharedWithId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("SharedPost");

                    b.Navigation("SharedWith");
                });

            modelBuilder.Entity("MentalHealthBlog.API.Models.UserRole", b =>
                {
                    b.HasOne("MentalHealthBlog.API.Models.Role", "Role")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MentalHealthBlogAPI.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Role");

                    b.Navigation("User");
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
