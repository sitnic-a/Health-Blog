using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentalHealthBlogAPI.Migrations
{
    /// <inheritdoc />
    public partial class TablePostsEmotions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PostsEmotions",
                columns: table => new
                {
                    PostId = table.Column<int>(type: "int", nullable: false),
                    EmotionId = table.Column<int>(type: "int", nullable: false)
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

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 2, 21, 17, 18, 43, 297, DateTimeKind.Local).AddTicks(1489));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 2, 21, 17, 18, 43, 297, DateTimeKind.Local).AddTicks(1541));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 2, 21, 17, 18, 43, 297, DateTimeKind.Local).AddTicks(1543));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 2, 21, 17, 18, 43, 297, DateTimeKind.Local).AddTicks(1567));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 2, 21, 17, 18, 43, 297, DateTimeKind.Local).AddTicks(1569));

            migrationBuilder.CreateIndex(
                name: "IX_PostsEmotions_EmotionId",
                table: "PostsEmotions",
                column: "EmotionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PostsEmotions");

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
    }
}
