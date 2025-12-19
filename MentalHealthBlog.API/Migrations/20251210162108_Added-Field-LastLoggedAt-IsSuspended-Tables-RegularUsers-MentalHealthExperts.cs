using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentalHealthBlog.API.Migrations
{
    /// <inheritdoc />
    public partial class AddedFieldLastLoggedAtIsSuspendedTablesRegularUsersMentalHealthExperts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "RegisteredAt",
                table: "RegularUsers",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2025, 12, 10, 16, 21, 8, 528, DateTimeKind.Utc).AddTicks(3822),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2025, 11, 12, 14, 33, 31, 258, DateTimeKind.Utc).AddTicks(6554));

            migrationBuilder.AddColumn<bool>(
                name: "IsSuspended",
                table: "RegularUsers",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastLoggedAt",
                table: "RegularUsers",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "RegisteredAt",
                table: "MentalHealthExperts",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2025, 12, 10, 16, 21, 8, 528, DateTimeKind.Utc).AddTicks(3822),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2025, 11, 12, 14, 33, 31, 258, DateTimeKind.Utc).AddTicks(6554));

            migrationBuilder.AddColumn<bool>(
                name: "IsSuspended",
                table: "MentalHealthExperts",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastLoggedAt",
                table: "MentalHealthExperts",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsSuspended",
                table: "RegularUsers");

            migrationBuilder.DropColumn(
                name: "LastLoggedAt",
                table: "RegularUsers");

            migrationBuilder.DropColumn(
                name: "IsSuspended",
                table: "MentalHealthExperts");

            migrationBuilder.DropColumn(
                name: "LastLoggedAt",
                table: "MentalHealthExperts");

            migrationBuilder.AlterColumn<DateTime>(
                name: "RegisteredAt",
                table: "RegularUsers",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2025, 11, 12, 14, 33, 31, 258, DateTimeKind.Utc).AddTicks(6554),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2025, 12, 10, 16, 21, 8, 528, DateTimeKind.Utc).AddTicks(3822));

            migrationBuilder.AlterColumn<DateTime>(
                name: "RegisteredAt",
                table: "MentalHealthExperts",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2025, 11, 12, 14, 33, 31, 258, DateTimeKind.Utc).AddTicks(6554),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2025, 12, 10, 16, 21, 8, 528, DateTimeKind.Utc).AddTicks(3822));
        }
    }
}
