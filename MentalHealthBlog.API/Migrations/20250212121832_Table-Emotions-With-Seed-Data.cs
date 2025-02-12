using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MentalHealthBlogAPI.Migrations
{
    /// <inheritdoc />
    public partial class TableEmotionsWithSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Emotions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Emotions", x => x.Id);
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

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 2, 12, 13, 18, 32, 742, DateTimeKind.Local).AddTicks(1785));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 2, 12, 13, 18, 32, 742, DateTimeKind.Local).AddTicks(1838));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 2, 12, 13, 18, 32, 742, DateTimeKind.Local).AddTicks(1839));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 2, 12, 13, 18, 32, 742, DateTimeKind.Local).AddTicks(1840));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 2, 12, 13, 18, 32, 742, DateTimeKind.Local).AddTicks(1842));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Emotions");

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 13, 13, 47, 36, 432, DateTimeKind.Local).AddTicks(4806));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 13, 13, 47, 36, 432, DateTimeKind.Local).AddTicks(4861));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 13, 13, 47, 36, 432, DateTimeKind.Local).AddTicks(4863));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 13, 13, 47, 36, 432, DateTimeKind.Local).AddTicks(4864));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 1, 13, 13, 47, 36, 432, DateTimeKind.Local).AddTicks(4866));
        }
    }
}
