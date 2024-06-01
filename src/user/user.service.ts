import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { NewTimerAndShortsDto } from './dto/new-timer-and-shorts.dto';
import axios from 'axios';

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

              if (index == entry) {
                resolve(responses?.flat());
              }
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
}
