using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentalHealthBlog.API.Migrations
{
    /// <inheritdoc />
    public partial class AddedFieldIsMentalHealthExpertInvitingTableTherapyRequests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsMentalHealthExpertInviting",
                table: "TherapyRequests",
                type: "boolean",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "RegisteredAt",
                table: "RegularUsers",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2026, 1, 16, 15, 25, 40, 541, DateTimeKind.Utc).AddTicks(4902),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2026, 1, 12, 10, 26, 50, 562, DateTimeKind.Utc).AddTicks(1366));

            migrationBuilder.AlterColumn<DateTime>(
                name: "RegisteredAt",
                table: "MentalHealthExperts",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2026, 1, 16, 15, 25, 40, 541, DateTimeKind.Utc).AddTicks(4902),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2026, 1, 12, 10, 26, 50, 562, DateTimeKind.Utc).AddTicks(1366));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsMentalHealthExpertInviting",
                table: "TherapyRequests");

            migrationBuilder.AlterColumn<DateTime>(
                name: "RegisteredAt",
                table: "RegularUsers",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2026, 1, 12, 10, 26, 50, 562, DateTimeKind.Utc).AddTicks(1366),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2026, 1, 16, 15, 25, 40, 541, DateTimeKind.Utc).AddTicks(4902));

            migrationBuilder.AlterColumn<DateTime>(
                name: "RegisteredAt",
                table: "MentalHealthExperts",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2026, 1, 12, 10, 26, 50, 562, DateTimeKind.Utc).AddTicks(1366),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2026, 1, 16, 15, 25, 40, 541, DateTimeKind.Utc).AddTicks(4902));
        }
    }
}
