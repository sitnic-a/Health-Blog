using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentalHealthBlogAPI.Migrations
{
    /// <inheritdoc />
    public partial class TableShares : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Shares",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ShareGuid = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SharedWithId = table.Column<int>(type: "int", nullable: false),
                    SharedPostId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Shares", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Shares_Posts_SharedPostId",
                        column: x => x.SharedPostId,
                        principalTable: "Posts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Shares_Users_SharedWithId",
                        column: x => x.SharedWithId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2024, 10, 26, 17, 48, 35, 908, DateTimeKind.Local).AddTicks(6919));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2024, 10, 26, 17, 48, 35, 908, DateTimeKind.Local).AddTicks(7001));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2024, 10, 26, 17, 48, 35, 908, DateTimeKind.Local).AddTicks(7004));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2024, 10, 26, 17, 48, 35, 908, DateTimeKind.Local).AddTicks(7015));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2024, 10, 26, 17, 48, 35, 908, DateTimeKind.Local).AddTicks(7018));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                column: "Name",
                value: "Psychologist / Psychotherapist");

            migrationBuilder.CreateIndex(
                name: "IX_Shares_SharedPostId",
                table: "Shares",
                column: "SharedPostId");

            migrationBuilder.CreateIndex(
                name: "IX_Shares_SharedWithId",
                table: "Shares",
                column: "SharedWithId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Shares");

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2024, 10, 17, 15, 6, 7, 681, DateTimeKind.Local).AddTicks(9891));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2024, 10, 17, 15, 6, 7, 681, DateTimeKind.Local).AddTicks(9955));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2024, 10, 17, 15, 6, 7, 681, DateTimeKind.Local).AddTicks(9957));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2024, 10, 17, 15, 6, 7, 681, DateTimeKind.Local).AddTicks(9959));

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2024, 10, 17, 15, 6, 7, 681, DateTimeKind.Local).AddTicks(9960));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                column: "Name",
                value: "Psychologist/Psychotherapist");
        }
    }
}
