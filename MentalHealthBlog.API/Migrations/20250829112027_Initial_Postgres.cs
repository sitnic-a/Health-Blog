using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MentalHealthBlog.API.Migrations
{
    /// <inheritdoc />
    public partial class Initial_Postgres : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Emotions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Emotions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MentalHealthExperts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    FirstName = table.Column<string>(type: "text", nullable: false),
                    LastName = table.Column<string>(type: "text", nullable: false),
                    Organization = table.Column<string>(type: "text", nullable: false),
                    PhoneNumber = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: true),
                    PhotoAsFile = table.Column<byte[]>(type: "bytea", nullable: true),
                    PhotoAsPath = table.Column<string>(type: "text", nullable: true),
                    IsApproved = table.Column<bool>(type: "boolean", nullable: false),
                    IsRejected = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MentalHealthExperts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tags",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tags", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Username = table.Column<string>(type: "text", nullable: false),
                    PasswordSalt = table.Column<byte[]>(type: "bytea", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Assignments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AssignmentGivenToId = table.Column<int>(type: "integer", nullable: false),
                    AssignmentGivenById = table.Column<int>(type: "integer", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Assignments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Assignments_MentalHealthExperts_AssignmentGivenById",
                        column: x => x.AssignmentGivenById,
                        principalTable: "MentalHealthExperts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Assignments_Users_AssignmentGivenToId",
                        column: x => x.AssignmentGivenToId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Posts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Posts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Posts_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RefreshTokens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Token = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    RevokedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ReplacedByToken = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RefreshTokens_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RegularUsers",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    FirstName = table.Column<string>(type: "text", nullable: false),
                    LastName = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegularUsers", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_RegularUsers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    RoleId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_UserRoles_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserRoles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PostsEmotions",
                columns: table => new
                {
                    PostId = table.Column<int>(type: "integer", nullable: false),
                    EmotionId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostsEmotions", x => new { x.PostId, x.EmotionId });
                    table.ForeignKey(
                        name: "FK_PostsEmotions_Emotions_EmotionId",
                        column: x => x.EmotionId,
                        principalTable: "Emotions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PostsEmotions_Posts_PostId",
                        column: x => x.PostId,
                        principalTable: "Posts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PostsTags",
                columns: table => new
                {
                    PostId = table.Column<int>(type: "integer", nullable: false),
                    TagId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostsTags", x => new { x.PostId, x.TagId });
                    table.ForeignKey(
                        name: "FK_PostsTags_Posts_PostId",
                        column: x => x.PostId,
                        principalTable: "Posts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PostsTags_Tags_TagId",
                        column: x => x.TagId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Shares",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ShareGuid = table.Column<string>(type: "text", nullable: false),
                    SharedWithId = table.Column<int>(type: "integer", nullable: true),
                    SharedPostId = table.Column<int>(type: "integer", nullable: false),
                    SharedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsKeepingContent = table.Column<bool>(type: "boolean", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Shares", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Shares_MentalHealthExperts_SharedWithId",
                        column: x => x.SharedWithId,
                        principalTable: "MentalHealthExperts",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Shares_Posts_SharedPostId",
                        column: x => x.SharedPostId,
                        principalTable: "Posts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TherapyRequests",
                columns: table => new
                {
                    RegularUserId = table.Column<int>(type: "integer", nullable: false),
                    MentalHealthExpertId = table.Column<int>(type: "integer", nullable: false),
                    RequestStatus = table.Column<int>(type: "integer", nullable: false),
                    SentAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TherapyRequests", x => new { x.RegularUserId, x.MentalHealthExpertId });
                    table.ForeignKey(
                        name: "FK_TherapyRequests_RegularUsers_RegularUserId",
                        column: x => x.RegularUserId,
                        principalTable: "RegularUsers",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Emotions",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Indifferent(Bad)" },
                    { 2, "Apathetic(Bad)" },
                    { 3, "Pressured(Bad)" },
                    { 4, "Rushed(Bad)" },
                    { 5, "Overwhelmed(Bad)" },
                    { 6, "Out of control(Bad)" },
                    { 7, "Sleepy(Bad)" },
                    { 8, "Unfocused(Bad)" },
                    { 9, "Shocked(Surprised)" },
                    { 10, "Dismayed(Surprised)" },
                    { 11, "Disillusioned(Surprised)" },
                    { 12, "Perplexed(Surprised)" },
                    { 13, "Astonished(Surprised)" },
                    { 14, "Awe(Surprised)" },
                    { 15, "Eager(Surprised)" },
                    { 16, "Energetic(Surprised)" },
                    { 17, "Aroused(Happy)" },
                    { 18, "Cheeky(Happy)" },
                    { 19, "Free(Happy)" },
                    { 20, "Joyful(Happy)" },
                    { 21, "Curious(Happy)" },
                    { 22, "Inquisitive(Happy)" },
                    { 23, "Successful(Happy)" },
                    { 24, "Confident(Happy)" },
                    { 25, "Respected(Happy)" },
                    { 26, "Valued(Happy)" },
                    { 27, "Courageous(Happy)" },
                    { 28, "Creative(Happy)" },
                    { 29, "Loving(Happy)" },
                    { 30, "Thankful(Happy)" },
                    { 31, "Sensitive(Happy)" },
                    { 32, "Intimate(Happy)" },
                    { 33, "Hopeful(Happy)" },
                    { 34, "Inspired(Happy)" },
                    { 35, "Betrayed(Angry)" },
                    { 36, "Resentful(Angry)" },
                    { 37, "Disrespected(Angry)" },
                    { 38, "Ridiculed(Angry)" },
                    { 39, "Indignant(Angry)" },
                    { 40, "Violated(Angry)" },
                    { 41, "Furious(Angry)" },
                    { 42, "Jealous(Angry)" },
                    { 43, "Provoked(Angry)" },
                    { 44, "Hostile(Angry)" },
                    { 45, "Infuriated(Angry)" },
                    { 46, "Annoyed(Angry)" },
                    { 47, "Withdrawn(Angry)" },
                    { 48, "Numb(Angry)" },
                    { 49, "Skeptical(Angry)" },
                    { 50, "Dismissive(Angry)" },
                    { 51, "Isolated(Sad)" },
                    { 52, "Abandoned(Sad)" },
                    { 53, "Victimized(Sad)" },
                    { 54, "Fragile(Sad)" },
                    { 55, "Grief(Sad)" },
                    { 56, "Powerless(Sad)" },
                    { 57, "Ashamed(Sad)" },
                    { 58, "Remorseful(Sad)" },
                    { 59, "Empty(Sad)" },
                    { 60, "Inferior(Sad)" },
                    { 61, "Disappointed(Sad)" },
                    { 62, "Embarrassed(Sad)" },
                    { 63, "Judgmental(Disgusted)" },
                    { 64, "Embarrassed(Disgusted)" },
                    { 65, "Appalled(Disgusted)" },
                    { 66, "Revolted(Disgusted)" },
                    { 67, "Nauseated(Disgusted)" },
                    { 68, "Detestable(Disgusted)" },
                    { 69, "Horrified(Disgusted)" },
                    { 70, "Hesitant(Disgusted)" },
                    { 71, "Helpless(Fearful)" },
                    { 72, "Frightened(Fearful)" },
                    { 73, "Overwhelmed(Fearful)" },
                    { 74, "Worried(Fearful)" },
                    { 75, "Inadequate(Fearful)" },
                    { 76, "Inferior(Fearful)" },
                    { 77, "Worthless(Fearful)" },
                    { 78, "Insignificant(Fearful)" },
                    { 79, "Excluded(Fearful)" },
                    { 80, "Persecuted(Fearful)" },
                    { 81, "Nervous(Fearful)" },
                    { 82, "Exposed(Fearful)" }
                });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Administrator" },
                    { 2, "User" },
                    { 3, "Parent" },
                    { 4, "Psychologist / Psychotherapist" }
                });

            migrationBuilder.InsertData(
                table: "Tags",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Ljubav" },
                    { 2, "Porodica" },
                    { 3, "Posao" },
                    { 4, "Zdravlje" },
                    { 5, "Prijatelji" },
                    { 6, "Karijera" },
                    { 7, "Novac" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "PasswordHash", "PasswordSalt", "Username" },
                values: new object[,]
                {
                    { 1, "TT1", new byte[] { 83, 101, 116, 66, 121, 116, 101, 115, 95, 84, 84, 49 }, "test_01" },
                    { 2, "TT2", new byte[] { 83, 101, 116, 66, 121, 116, 101, 115, 95, 84, 84, 50 }, "test_02" },
                    { 3, "TT3", new byte[] { 83, 101, 116, 66, 121, 116, 101, 115, 95, 84, 84, 51 }, "test_03" },
                    { 4, "TT4", new byte[] { 83, 101, 116, 66, 121, 116, 101, 115, 95, 84, 84, 52 }, "test_04" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Assignments_AssignmentGivenById",
                table: "Assignments",
                column: "AssignmentGivenById");

            migrationBuilder.CreateIndex(
                name: "IX_Assignments_AssignmentGivenToId",
                table: "Assignments",
                column: "AssignmentGivenToId");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_UserId",
                table: "Posts",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PostsEmotions_EmotionId",
                table: "PostsEmotions",
                column: "EmotionId");

            migrationBuilder.CreateIndex(
                name: "IX_PostsTags_TagId",
                table: "PostsTags",
                column: "TagId");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_UserId",
                table: "RefreshTokens",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Shares_SharedPostId",
                table: "Shares",
                column: "SharedPostId");

            migrationBuilder.CreateIndex(
                name: "IX_Shares_SharedWithId",
                table: "Shares",
                column: "SharedWithId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_RoleId",
                table: "UserRoles",
                column: "RoleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Assignments");

            migrationBuilder.DropTable(
                name: "PostsEmotions");

            migrationBuilder.DropTable(
                name: "PostsTags");

            migrationBuilder.DropTable(
                name: "RefreshTokens");

            migrationBuilder.DropTable(
                name: "Shares");

            migrationBuilder.DropTable(
                name: "TherapyRequests");

            migrationBuilder.DropTable(
                name: "UserRoles");

            migrationBuilder.DropTable(
                name: "Emotions");

            migrationBuilder.DropTable(
                name: "Tags");

            migrationBuilder.DropTable(
                name: "MentalHealthExperts");

            migrationBuilder.DropTable(
                name: "Posts");

            migrationBuilder.DropTable(
                name: "RegularUsers");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
