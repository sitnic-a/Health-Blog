using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MentalHealthBlog.API.Migrations
{
    /// <inheritdoc />
    public partial class ProfileMetaDataTablesUsersMentalHealthExpertsRegularUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsUsingForTheFirstTime",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "HavePaidForSubscription",
                table: "RegularUsers",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsInTrialPeriod",
                table: "RegularUsers",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RegisteredAt",
                table: "RegularUsers",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2025, 10, 31, 10, 40, 53, 142, DateTimeKind.Utc).AddTicks(1308));

            migrationBuilder.AddColumn<DateTime>(
                name: "TrialEndsAt",
                table: "RegularUsers",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2025, 11, 7, 10, 40, 53, 142, DateTimeKind.Utc).AddTicks(1308));

            migrationBuilder.AddColumn<DateTime>(
                name: "ApprovedAt",
                table: "MentalHealthExperts",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HavePaidForSubscription",
                table: "MentalHealthExperts",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsInTrialPeriod",
                table: "MentalHealthExperts",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "RegisteredAt",
                table: "MentalHealthExperts",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2025, 10, 31, 10, 40, 53, 142, DateTimeKind.Utc).AddTicks(1308));

            migrationBuilder.AddColumn<DateTime>(
                name: "TrialEndsAt",
                table: "MentalHealthExperts",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2025, 11, 7, 10, 40, 53, 142, DateTimeKind.Utc).AddTicks(1308));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsUsingForTheFirstTime",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "HavePaidForSubscription",
                table: "RegularUsers");

            migrationBuilder.DropColumn(
                name: "IsInTrialPeriod",
                table: "RegularUsers");

            migrationBuilder.DropColumn(
                name: "RegisteredAt",
                table: "RegularUsers");

            migrationBuilder.DropColumn(
                name: "TrialEndsAt",
                table: "RegularUsers");

            migrationBuilder.DropColumn(
                name: "ApprovedAt",
                table: "MentalHealthExperts");

            migrationBuilder.DropColumn(
                name: "HavePaidForSubscription",
                table: "MentalHealthExperts");

            migrationBuilder.DropColumn(
                name: "IsInTrialPeriod",
                table: "MentalHealthExperts");

            migrationBuilder.DropColumn(
                name: "RegisteredAt",
                table: "MentalHealthExperts");

            migrationBuilder.DropColumn(
                name: "TrialEndsAt",
                table: "MentalHealthExperts");
        }
    }
}
