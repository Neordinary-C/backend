import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { NewTimerAndShortsDto } from './dto/new-timer-and-shorts.dto';
import axios from 'axios';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateNumberDto } from './dto/update-number.dto';
import { StartTimerDto } from './dto/user-timer.dto';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    //check if id already exists
    const getUsersWithId = await this.databaseService.user.findMany({
      where: { user_id: createUserDto.user_id },
    });

    if (getUsersWithId?.length > 0) {
      return {
        success: 'error',
        reason: '이미 존재하는 ID입니다.',
      };
    }

    await this.databaseService.user.create({
      data: createUserDto,
    });

    return {
      success: 'ok',
    };
  }

  async saveNewTimerAndShorts(newTimerAndShorts: NewTimerAndShortsDto) {
    const user = await this.databaseService.user.findFirst({
      where: { user_id: newTimerAndShorts.user_id },
    });

    if (!user)
      return {
        success: 'error',
        reason: '유저가 존재하지 않습니다.',
      };

    //User Shorts
    const userShorts = (
      await this.databaseService.userShorts.findMany({
        where: { user_id: user.id },
      })
    )?.pop();

    if (!userShorts) {
      await this.databaseService.userShorts.create({
        data: {
          user_id: user.id,
          user_count: newTimerAndShorts.count,
          watched_count: newTimerAndShorts.count,
          categories: newTimerAndShorts.categories,
        },
      });
    } else {
      await this.databaseService.userShorts.update({
        where: { user_id: user.id, id: userShorts.id },
        data: {
          user_count: newTimerAndShorts.count,
          watched_count: newTimerAndShorts.count,
          categories: newTimerAndShorts.categories,
        },
      });
    }

    //User Timer
    await this.databaseService.userTimer.create({
      data: {
        user_id: user.id,
        status: 'ongoing',
        timer_h: newTimerAndShorts.time_h,
        timer_m: newTimerAndShorts.time_m,
      },
    });

    return {
      success: 'ok',
    };
  }

  async getShortsCount(user_id: string) {
    const user = await this.databaseService.user.findFirst({
      where: { user_id },
    });

    if (!user)
      return {
        success: 'error',
        reason: '유저가 존재하지 않습니다.',
      };

    const userShorts = await this.databaseService.userShorts.findFirst({
      where: { user_id: user.id },
    });

    return {
      success: 'ok',
      count: userShorts?.user_count,
    };
  }

  async getShorts(user_id: string) {
    const user = await this.databaseService.user.findFirst({
      where: { user_id },
    });

    if (!user) return { success: 'error', reason: '유저가 존재하지 않습니다.' };

    const userShorts = await this.databaseService.userShorts.findFirst({
      where: { user_id: user.id },
    });

    const videoCounts = userShorts.user_count;
    const categoryIdList = userShorts.categories as any;

    //randomizer
    function spreadNumbers(totalNumber, numParts, variationRange = 1) {
      // Create an array to store the parts
      const parts = new Array(numParts).fill(0);

      // Distribute the total number randomly among the parts
      let remaining = totalNumber;
      for (let i = 0; i < numParts - 1; i++) {
        // Generate a random number within the variation range
        const minValue = Math.max(1, parts[i] - variationRange);
        const maxValue = Math.min(
          remaining - (numParts - i - 1),
          parts[i] + variationRange,
        );
        const randomValue =
          minValue + Math.floor(Math.random() * (maxValue - minValue + 1));

        // Assign the random value to the current part
        parts[i] = randomValue;
        remaining -= randomValue;
      }

      // Assign the remaining value to the last part
      parts[numParts - 1] = remaining;

      return parts;
    }

    const entries = spreadNumbers(videoCounts, categoryIdList.length);

    const getAllShorts = new Promise<any>((resolve, reject) => {
      const responses = [];

      entries.forEach((entry, index) => {
        let nextPageToken;

        for (let i = 0; i < entry; i++) {
          const url = nextPageToken
            ? `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=${entry}&regionCode=kr&videoCategoryId=${categoryIdList[index]}&videoDefinition=shortDefinition&key=${process.env.YOUTUBE_API_KEY}&pageToken=${nextPageToken}`
            : `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=${entry}&regionCode=kr&videoCategoryId=${categoryIdList[index]}&videoDefinition=shortDefinition&key=${process.env.YOUTUBE_API_KEY}`;
          axios
            .get(url)
            .then((response) => {
              responses.push({
                videos: response.data?.items?.map((item) => {
                  return {
                    url: `https://www.youtube.com/shorts/${item?.id}`,
                    thumbnails: item?.snippet?.thumbnails,
                    // nextPageToken: response.data?.nextPageToken,
                  };
                }),
              });

              if (response.data?.nextPageToken) {
                nextPageToken = response.data?.nextPageToken;
              }

              console.log(
                'Received Response. ' +
                  response.data?.items?.map((item) => item?.id),
              );

              setTimeout(() => {
                resolve(responses?.flat());
              }, 10000);
            })
            .catch((e) => {
              console.log(e);
              reject(e);
            });
        }
      });
    });

    return {
      success: 'ok',
      data: await getAllShorts,
    };
  }

  async getUserTimerStatus(userId) {
    const users = await this.databaseService.userTimer.findMany({
      where: { user_id: +userId },
    });
    const user = users.pop();
    return {
      success: 'ok',
      status: user.status,
    };
  }

  async getUserTimerTimes(userId) {
    const users = await this.databaseService.userTimer.findMany({
      where: { user_id: +userId },
    });
    const user = users.pop();
    return {
      success: 'ok',
      start_time: user.start_time,
      timer_hour: user.timer_h,
      timer_minuate: user.timer_m,
    };
  }

  async getSuccessDays(userId, status) {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const userTimers = await this.databaseService.userTimer.findMany({
      where: {
        user_id: +userId,
        status: status,
      },
    });
    console.log(userTimers);
    const successDays = userTimers
      .filter((u) => u.start_time >= threeMonthsAgo)
      .map((timer) => timer.start_time);

    console.log(successDays);
    return {
      success: 'ok',
      days: successDays,
    };
  }

  async getMypage(userId) {
    const user = await this.databaseService.userStat.findFirst({
      where: { user_id: +userId },
    });
    return {
      success: 'ok',
      user_score: user.total_score.toString(),
      user_shortscount: user.total_count.toString(),
      user_total_time_h: user.total_timer_h.toString(),
      user_total_time_m: user.total_timer_m.toString(),
    };
  }

  async updateTimerStatus(UpdateStatusDto: UpdateStatusDto) {
    console.log(UpdateStatusDto);
    const users = await this.databaseService.userTimer.findMany({
      where: {
        user_id: +UpdateStatusDto.user_id,
      },
    });
    const user = users.pop();
    console.log(user);

    await this.databaseService.userTimer.updateMany({
      where: {
        user_id: +user.user_id,
      },
      data: {
        status: UpdateStatusDto.status,
      },
    });
  }

  async getShortsSeenNumber(userId: string) {
    const user = await this.databaseService.user.findFirst({
      where: {
        user_id: userId,
      },
    });
    const userShorts = await this.databaseService.userShorts.findFirst({
      where: {
        user_id: user.id,
      },
    });
    return {
      success: 'ok',
      number: userShorts.watched_count ? userShorts.watched_count : 0,
    };
  }

  async getPlanTimer(userId: string) {
    const user = await this.databaseService.user.findFirst({
      where: {
        user_id: userId,
      },
    });
    const user_timer = await this.databaseService.userTimer.findFirst({
      where: {
        user_id: user.id,
      },
    });
    return {
      success: 'ok',
      time_h: user_timer ? user_timer.timer_h : 0,
      time_m: user_timer ? user_timer.timer_m : 0,
    };
  }
  async startTime(startTimeDto: StartTimerDto) {
    const user = await this.databaseService.user.findFirst({
      where: {
        user_id: startTimeDto.user_id,
      },
    });
    const user_timer = await this.databaseService.userTimer.findFirst({
      where: {
        user_id: user.id,
      },
    });
    await this.databaseService.userTimer.create({
      data: {
        start_time: user_timer.start_time,
      },
    });

    return {
      success: 'ok',
    };
  }

  async updateSeenNumber(updateNumberDto: UpdateNumberDto) {
    const user = await this.databaseService.user.findFirst({
      where: {
        user_id: updateNumberDto.user_id,
      },
    });
    const user_shorts = await this.databaseService.userShorts.findMany({
      where: {
        user_id: user.id,
      },
    });
    await this.databaseService.userShorts.updateMany({
      where: {
        user_id: user.id,
        created_at: user_shorts.pop().created_at,
      },
      data: {
        watched_count: updateNumberDto.watched_count,
      },
    });
  }
}
