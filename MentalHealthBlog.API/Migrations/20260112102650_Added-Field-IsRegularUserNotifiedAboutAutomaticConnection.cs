using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentalHealthBlog.API.Migrations
{
    /// <inheritdoc />
    public partial class AddedFieldIsRegularUserNotifiedAboutAutomaticConnection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsRegularUserNotifiedAboutAutomaticConnection",
                table: "TherapyInvites",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<DateTime>(
                name: "RegisteredAt",
                table: "RegularUsers",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2026, 1, 12, 10, 26, 50, 562, DateTimeKind.Utc).AddTicks(1366),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2026, 1, 6, 17, 35, 2, 260, DateTimeKind.Utc).AddTicks(2058));

            migrationBuilder.AlterColumn<DateTime>(
                name: "RegisteredAt",
                table: "MentalHealthExperts",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2026, 1, 12, 10, 26, 50, 562, DateTimeKind.Utc).AddTicks(1366),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2026, 1, 6, 17, 35, 2, 260, DateTimeKind.Utc).AddTicks(2058));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRegularUserNotifiedAboutAutomaticConnection",
                table: "TherapyInvites");

            migrationBuilder.AlterColumn<DateTime>(
                name: "RegisteredAt",
                table: "RegularUsers",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2026, 1, 6, 17, 35, 2, 260, DateTimeKind.Utc).AddTicks(2058),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2026, 1, 12, 10, 26, 50, 562, DateTimeKind.Utc).AddTicks(1366));

            migrationBuilder.AlterColumn<DateTime>(
                name: "RegisteredAt",
                table: "MentalHealthExperts",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2026, 1, 6, 17, 35, 2, 260, DateTimeKind.Utc).AddTicks(2058),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2026, 1, 12, 10, 26, 50, 562, DateTimeKind.Utc).AddTicks(1366));
        }
    }
}
